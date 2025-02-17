/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EuiSideNavItemType } from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import React, { useMemo } from 'react';
import { matchPath, useLocation } from 'react-router-dom';
import useObservable from 'react-use/lib/useObservable';
import type { Observable } from 'rxjs';
import type { ApplicationStart } from '../../../../../../../src/core/public';
import {
  KibanaPageTemplate,
  KibanaPageTemplateProps,
} from '../../../../../../../src/plugins/kibana_react/public';
import type { NavigationSection } from '../../../services/navigation_registry';
import { NavNameWithBadge, hideBadge } from './nav_name_with_badge';

export type WrappedPageTemplateProps = Pick<
  KibanaPageTemplateProps,
  | 'children'
  | 'data-test-subj'
  | 'paddingSize'
  | 'pageBodyProps'
  | 'pageContentBodyProps'
  | 'pageContentProps'
  | 'pageHeader'
  | 'restrictWidth'
  | 'template'
  | 'isEmptyState'
>;

export interface ObservabilityPageTemplateDependencies {
  currentAppId$: Observable<string | undefined>;
  getUrlForApp: ApplicationStart['getUrlForApp'];
  navigateToApp: ApplicationStart['navigateToApp'];
  navigationSections$: Observable<NavigationSection[]>;
}

export type ObservabilityPageTemplateProps = ObservabilityPageTemplateDependencies &
  WrappedPageTemplateProps;

export function ObservabilityPageTemplate({
  children,
  currentAppId$,
  getUrlForApp,
  navigateToApp,
  navigationSections$,
  ...pageTemplateProps
}: ObservabilityPageTemplateProps): React.ReactElement | null {
  const sections = useObservable(navigationSections$, []);
  const currentAppId = useObservable(currentAppId$, undefined);
  const { pathname: currentPath } = useLocation();

  const sideNavItems = useMemo<Array<EuiSideNavItemType<unknown>>>(
    () =>
      sections.map(({ label, entries }, sectionIndex) => ({
        id: `${sectionIndex}`,
        name: label,
        items: entries.map((entry, entryIndex) => {
          const href = getUrlForApp(entry.app, {
            path: entry.path,
          });

          const isSelected =
            entry.app === currentAppId &&
            matchPath(currentPath, {
              path: entry.path,
              exact: !!entry.matchFullPath,
              strict: !entry.ignoreTrailingSlash,
            }) != null;
          const badgeLocalStorageId = `observability.nav_item_badge_visible_${entry.app}${entry.path}`;
          return {
            id: `${sectionIndex}.${entryIndex}`,
            name: entry.sideBadgeLabel ? (
              <NavNameWithBadge
                label={entry.label}
                badgeLabel={entry.sideBadgeLabel}
                localstorageId={badgeLocalStorageId}
              />
            ) : (
              entry.label
            ),
            href,
            isSelected,
            onClick: (event) => {
              if (entry.onClick) {
                entry.onClick(event);
              }

              // When side badge is defined hides it when the item is clicked
              if (entry.sideBadgeLabel) {
                hideBadge(badgeLocalStorageId);
              }

              if (
                event.button !== 0 ||
                event.defaultPrevented ||
                event.metaKey ||
                event.altKey ||
                event.ctrlKey ||
                event.shiftKey
              ) {
                return;
              }

              event.preventDefault();
              navigateToApp(entry.app, {
                path: entry.path,
              });
            },
          };
        }),
      })),
    [currentAppId, currentPath, getUrlForApp, navigateToApp, sections]
  );

  return (
    <KibanaPageTemplate
      restrictWidth={false}
      {...pageTemplateProps}
      solutionNav={{
        icon: 'logoObservability',
        items: sideNavItems,
        name: sideNavTitle,
      }}
    >
      {children}
    </KibanaPageTemplate>
  );
}

// for lazy import
// eslint-disable-next-line import/no-default-export
export default ObservabilityPageTemplate;

const sideNavTitle = i18n.translate('xpack.observability.pageLayout.sideNavTitle', {
  defaultMessage: 'Observability',
});
