import React from 'react';
import {Theme} from '../../utilities/theme';
import ThemeProvider from '../ThemeProvider';
import {I18n, I18nContext, TranslationDictionary} from '../../utilities/i18n';
import {
  ScrollLockManager,
  ScrollLockManagerContext,
} from '../../utilities/scroll-lock-manager';
import {
  createAppBridge,
  AppBridgeContext,
  AppBridgeOptions,
} from '../../utilities/app-bridge';
import {
  StickyManager,
  StickyManagerContext,
} from '../../utilities/sticky-manager';
import {LinkContext, LinkLikeComponent} from '../../utilities/link';

interface State {
  intl: I18n;
  appBridge: ReturnType<typeof createAppBridge>;
  link: LinkLikeComponent | undefined;
}

export interface Props extends AppBridgeOptions {
  /** A locale object or array of locale objects that overrides default translations */
  i18n: TranslationDictionary | TranslationDictionary[];
  /** A custom component to use for all links used by Polaris components */
  linkComponent?: LinkLikeComponent;
  /** Custom logos and colors provided to select components */
  theme?: Theme;
}

export default class AppProvider extends React.Component<Props, State> {
  private stickyManager: StickyManager;
  private scrollLockManager: ScrollLockManager;

  constructor(props: Props) {
    super(props);
    this.stickyManager = new StickyManager();
    this.scrollLockManager = new ScrollLockManager();
    const {i18n, apiKey, shopOrigin, forceRedirect, linkComponent} = this.props;

    // eslint-disable-next-line react/state-in-constructor
    this.state = {
      link: linkComponent,
      intl: new I18n(i18n),
      appBridge: createAppBridge({shopOrigin, apiKey, forceRedirect}),
    };
  }

  componentDidMount() {
    if (document != null) {
      this.stickyManager.setContainer(document);
    }
  }

  componentDidUpdate({
    i18n: prevI18n,
    linkComponent: prevLinkComponent,
    apiKey: prevApiKey,
    shopOrigin: prevShopOrigin,
    forceRedirect: prevForceRedirect,
  }: Props) {
    const {i18n, linkComponent, apiKey, shopOrigin, forceRedirect} = this.props;

    if (
      i18n === prevI18n &&
      linkComponent === prevLinkComponent &&
      apiKey === prevApiKey &&
      shopOrigin === prevShopOrigin &&
      forceRedirect === prevForceRedirect
    ) {
      return;
    }

    // eslint-disable-next-line react/no-did-update-set-state
    this.setState({
      link: linkComponent,
      intl: new I18n(i18n),
      appBridge: createAppBridge({shopOrigin, apiKey, forceRedirect}),
    });
  }

  render() {
    const {theme = {logo: null}, children} = this.props;
    const {intl, appBridge, link} = this.state;

    return (
      <I18nContext.Provider value={intl}>
        <ScrollLockManagerContext.Provider value={this.scrollLockManager}>
          <StickyManagerContext.Provider value={this.stickyManager}>
            <AppBridgeContext.Provider value={appBridge}>
              <LinkContext.Provider value={link}>
                <ThemeProvider theme={theme}>
                  {React.Children.only(children)}
                </ThemeProvider>
              </LinkContext.Provider>
            </AppBridgeContext.Provider>
          </StickyManagerContext.Provider>
        </ScrollLockManagerContext.Provider>
      </I18nContext.Provider>
    );
  }
}
