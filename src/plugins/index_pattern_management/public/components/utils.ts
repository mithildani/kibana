/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { IndexPatternsContract } from 'src/plugins/data/public';
import { IndexPattern, IFieldType } from 'src/plugins/data/public';
import { i18n } from '@kbn/i18n';

const defaultIndexPatternListName = i18n.translate(
  'indexPatternManagement.editIndexPattern.list.defaultIndexPatternListName',
  {
    defaultMessage: 'Default',
  }
);

const rollupIndexPatternListName = i18n.translate(
  'indexPatternManagement.editIndexPattern.list.rollupIndexPatternListName',
  {
    defaultMessage: 'Rollup',
  }
);

const isRollup = (indexPattern: IndexPattern) => {
  return indexPattern.type === 'rollup';
};

export async function getIndexPatterns(
  defaultIndex: string,
  indexPatternsService: IndexPatternsContract
) {
  const existingIndexPatterns = await indexPatternsService.getIdsWithTitle(true);
  const indexPatternsListItems = await Promise.all(
    existingIndexPatterns.map(async ({ id, title }) => {
      const isDefault = defaultIndex === id;
      const pattern = await indexPatternsService.get(id);
      const tags = getTags(pattern, isDefault);

      return {
        id,
        title,
        default: isDefault,
        tags,
        // the prepending of 0 at the default pattern takes care of prioritization
        // so the sorting will but the default index on top
        // or on bottom of a the table
        sort: `${isDefault ? '0' : '1'}${title}`,
      };
    })
  );

  return (
    indexPatternsListItems.sort((a, b) => {
      if (a.sort < b.sort) {
        return -1;
      } else if (a.sort > b.sort) {
        return 1;
      } else {
        return 0;
      }
    }) || []
  );
}

export const getTags = (indexPattern: IndexPattern, isDefault: boolean) => {
  const tags = [];
  if (isDefault) {
    tags.push({
      key: 'default',
      name: defaultIndexPatternListName,
    });
  }
  if (isRollup(indexPattern)) {
    tags.push({
      key: 'rollup',
      name: rollupIndexPatternListName,
    });
  }
  return tags;
};

export const areScriptedFieldsEnabled = (indexPattern: IndexPattern) => {
  return !isRollup(indexPattern);
};

export const getFieldInfo = (indexPattern: IndexPattern, field: IFieldType) => {
  if (!isRollup(indexPattern)) {
    return [];
  }

  const allAggs = indexPattern.typeMeta && indexPattern.typeMeta.aggs;
  const fieldAggs = allAggs && Object.keys(allAggs).filter((agg) => allAggs[agg][field.name]);

  if (!fieldAggs || !fieldAggs.length) {
    return [];
  }

  return ['Rollup aggregations:'].concat(
    fieldAggs.map((aggName) => {
      const agg = allAggs![aggName][field.name];
      switch (aggName) {
        case 'date_histogram':
          return i18n.translate(
            'indexPatternManagement.editIndexPattern.list.dateHistogramSummary',
            {
              defaultMessage: '{aggName} (interval: {interval}, {delay} {time_zone})',
              values: {
                aggName,
                interval: agg.fixed_interval,
                delay: agg.delay
                  ? i18n.translate(
                      'indexPatternManagement.editIndexPattern.list.DateHistogramDelaySummary',
                      {
                        defaultMessage: 'delay: {delay},',
                        values: {
                          delay: agg.delay,
                        },
                      }
                    )
                  : '',
                time_zone: agg.time_zone,
              },
            }
          );
        case 'histogram':
          return i18n.translate('indexPatternManagement.editIndexPattern.list.histogramSummary', {
            defaultMessage: '{aggName} (interval: {interval})',
            values: {
              aggName,
              interval: agg.interval,
            },
          });
        default:
          return aggName;
      }
    })
  );
};
