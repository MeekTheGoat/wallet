import { useFocusEffect } from '@react-navigation/native';
import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useGlobalState } from '@/components/GlobalState';
import { useExploreFeed } from '@/reactQuery/hooks/useExploreFeed';
import { RealmSettingsKey, useSettingsByKey, useSettingsMutations } from '@/realm/settings';
import type { NavigationProps } from '@/Routes';

import { isInAppBrowserEnabled } from '@/utils/featureFlags';
import { navigationStyle } from '@/utils/navigationStyle';

import { HomeHeaderAccountSwitch } from '../Home/components/HomeHeaderAccountSwitch';
import { HomeHeaderRight } from '../Home/components/HomeHeaderRight';

import { ExploreDisclaimerSheet } from './components/ExploreDisclaimerSheet';
import { ExploreFeed } from './components/ExploreFeed';
import { ExploreScrollView } from './components/ExploreScrollView';
import { ExploreSearchBar } from './components/ExploreSearch';
import { ExploreAnimationContextProvider } from './context/ExploreAnimationContext';
import { Sizes } from './ExploreScreen.constants';
import { useExploreScreenUnmountAnimation } from './hooks/useExploreScreenUnmountAnimation';

import type BottomSheetRef from '@gorhom/bottom-sheet';

export const ExploreScreen = ({ navigation }: NavigationProps<'Explore'>) => {
  const { isFetched, isSuccess, data = [] } = useExploreFeed();
  const [, setShowNavTabs] = useGlobalState('showNavTabs');
  const sheetRef = useRef<BottomSheetRef>(null);
  const hasAcceptedWarning = !!useSettingsByKey(RealmSettingsKey.hasAcceptedExploreWarning);
  const { setHasAcceptedExploreWarning } = useSettingsMutations();

  const onDisclaimerContinue = () => {
    sheetRef?.current?.close();
    setShowNavTabs(true);
  };
  const onDisclaimerDismiss = () => {
    if (hasAcceptedWarning) {
      return;
    }
    setShowNavTabs(true);
    navigation.goBack();
  };
  const onDisclaimerClose = () => {
    setHasAcceptedExploreWarning(true);
    setShowNavTabs(true);
  };
  const onDisclaimerMount = () => {
    setShowNavTabs(false);
  };

  const insets = useSafeAreaInsets();

  useFocusEffect(() => {
    if (hasAcceptedWarning) {
      setShowNavTabs(true);
    }
  });

  const { animatedStyle, animateScreenUnmount } = useExploreScreenUnmountAnimation();

  return (
    <ExploreAnimationContextProvider animateScreenUnmount={animateScreenUnmount}>
      <ExploreScrollView style={{ paddingTop: insets.top + Sizes.Space.s4 }}>
        {isInAppBrowserEnabled() ? (
          <View style={styles.searchBarContainer}>
            <ExploreSearchBar />
          </View>
        ) : null}
        <Animated.View style={animatedStyle}>
          <ExploreFeed feedData={data} loaded={isFetched && isSuccess} />
        </Animated.View>
      </ExploreScrollView>
      {!hasAcceptedWarning && (
        <ExploreDisclaimerSheet
          ref={sheetRef}
          onContinue={onDisclaimerContinue}
          onDismiss={onDisclaimerDismiss}
          onClose={onDisclaimerClose}
          onMount={onDisclaimerMount}
        />
      )}
    </ExploreAnimationContextProvider>
  );
};

ExploreScreen.navigationOptions = navigationStyle({
  headerTransparent: true,
  headerTitle: () => '',
  headerRight: () => <HomeHeaderRight />,
  headerLeft: () => <HomeHeaderAccountSwitch />,
});

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  searchBarContainer: {
    paddingHorizontal: Sizes.Space.s2,
  },
});