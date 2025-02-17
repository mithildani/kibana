/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { flatten, omit, isEmpty } from 'lodash';
import { useHistory } from 'react-router-dom';
import { useFetcher } from './use_fetcher';
import { toQuery, fromQuery } from '../components/shared/Links/url_helpers';
import { maybe } from '../../common/utils/maybe';
import { APIReturnType } from '../services/rest/createCallApmApi';
import { useUrlParams } from '../context/url_params_context/use_url_params';
import { useApmServiceContext } from '../context/apm_service/use_apm_service_context';

type APIResponse = APIReturnType<'GET /api/apm/services/{serviceName}/transactions/charts/distribution'>;

const INITIAL_DATA = {
  buckets: [] as APIResponse['buckets'],
  noHits: true,
  bucketSize: 0,
};

export function useTransactionDistributionFetcher({
  transactionName,
  kuery,
  environment,
}: {
  transactionName: string;
  kuery: string;
  environment: string;
}) {
  const { serviceName, transactionType } = useApmServiceContext();

  const {
    urlParams: { start, end, transactionId, traceId },
  } = useUrlParams();

  const history = useHistory();
  const { data = INITIAL_DATA, status, error } = useFetcher(
    async (callApmApi) => {
      if (serviceName && start && end && transactionType && transactionName) {
        const response = await callApmApi({
          endpoint:
            'GET /api/apm/services/{serviceName}/transactions/charts/distribution',
          params: {
            path: {
              serviceName,
            },
            query: {
              environment,
              kuery,
              start,
              end,
              transactionType,
              transactionName,
              transactionId,
              traceId,
            },
          },
        });

        const selectedSample =
          transactionId && traceId
            ? flatten(response.buckets.map((bucket) => bucket.samples)).find(
                (sample) =>
                  sample.transactionId === transactionId &&
                  sample.traceId === traceId
              )
            : undefined;

        if (!selectedSample) {
          // selected sample was not found. select a new one:
          // sorted by total number of requests, but only pick
          // from buckets that have samples
          const bucketsSortedByCount = response.buckets
            .filter((bucket) => !isEmpty(bucket.samples))
            .sort((bucket) => bucket.count);

          const preferredSample = maybe(bucketsSortedByCount[0]?.samples[0]);

          history.replace({
            ...history.location,
            search: fromQuery({
              ...omit(toQuery(history.location.search), [
                'traceId',
                'transactionId',
              ]),
              ...preferredSample,
            }),
          });
        }

        return response;
      }
    },
    // the histogram should not be refetched if the transactionId or traceId changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      environment,
      kuery,
      serviceName,
      start,
      end,
      transactionType,
      transactionName,
    ]
  );

  return {
    distributionData: data,
    distributionStatus: status,
    distributionError: error,
  };
}
