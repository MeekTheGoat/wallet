import { noop } from 'lodash';
import React from 'react';

import { useExploreFeed } from '@/reactQuery/hooks/useExploreFeed';
import type { NavigationProps } from '@/Routes';
import { navigationStyle } from '@/utils/navigationStyle';

import { ExploreFeed } from './components/ExploreFeed';

import { ExploreScrollView } from './components/ExploreScrollView';
import { ExploreAnimationContextProvider } from './context/ExploreAnimationContext';

export type ExploreSubpageNavigationParams = {
  slug?: string;
};

export const ExploreSubpageScreen = ({ route }: NavigationProps<'ExploreSubpage'>) => {
  const { params } = route;
  const { slug = '' } = params;
  const { isFetched, isSuccess, data = [] } = useExploreFeed(slug);

  return (
    <ExploreAnimationContextProvider animateScreenUnmount={noop}>
      <ExploreScrollView>
        <ExploreFeed feedData={data} loaded={isFetched && isSuccess} />
      </ExploreScrollView>
    </ExploreAnimationContextProvider>
  );
};

ExploreSubpageScreen.navigationOptions = navigationStyle({
  headerTransparent: true,
  title: '',
});
