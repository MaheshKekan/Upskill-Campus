import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClerkProvider, SignIn, SignUp } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  AdminPage,
  BrowsePage,
  CheckoutPage,
  HomePage,
  MerchantDashboardPage,
  MerchantOnboardingPage,
  MerchantPage,
  OrdersPage,
} from '@/pages/marketplace-pages';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: 'clerk',
  options: {
    logoPlacement: 'inside' as const,
    logoLinkUrl: basePath || '/',
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: '#cf4d32',
    colorForeground: '#252b3d',
    colorMutedForeground: '#6f7380',
    colorDanger: '#b83f38',
    colorBackground: '#fffdfa',
    colorInput: '#fffdfa',
    colorInputForeground: '#252b3d',
    colorNeutral: '#ddd7ca',
    fontFamily: 'DM Sans, sans-serif',
    borderRadius: '0.8rem',
  },
  elements: {
    rootBox: 'w-full flex justify-center',
    cardBox: 'bg-[#fffdfa] rounded-2xl w-[440px] max-w-full overflow-hidden shadow-sm',
    card: '!shadow-none !border-0 !bg-transparent !rounded-none',
    footer: '!shadow-none !border-0 !bg-transparent !rounded-none',
    headerTitle: 'font-display !text-[#252b3d]',
    headerSubtitle: '!text-[#6f7380]',
    socialButtonsBlockButtonText: '!text-[#252b3d]',
    formFieldLabel: '!text-[#252b3d]',
    footerActionLink: '!text-[#cf4d32]',
    footerActionText: '!text-[#6f7380]',
    dividerText: '!text-[#6f7380]',
    formButtonPrimary: 'bg-[#cf4d32] hover:bg-[#b8432c]',
    formFieldInput: '!bg-[#fffdfa] !text-[#252b3d]',
    footerAction: '!bg-transparent',
    dividerLine: '!bg-[#ddd7ca]',
    alert: '!bg-[#fff2ee]',
    alertText: '!text-[#b83f38]',
    main: 'bg-transparent',
  },
};

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/browse" component={BrowsePage} />
        <Route path="/merchant/:slug" component={MerchantPage} />
        <Route path="/checkout/:merchantSlug/:serviceId" component={CheckoutPage} />
        <Route path="/orders" component={OrdersPage} />
        <Route path="/merchant-dashboard" component={MerchantDashboardPage} />
        <Route path="/merchant-onboarding" component={MerchantOnboardingPage} />
        <Route path="/sign-in/*?" component={ClerkSignInPage} />
        <Route path="/sign-up/*?" component={ClerkSignUpPage} />
        <Route path="/admin" component={AdminPage} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function ClerkSignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-10">
      <SignIn
        routing="path"
        path={`${basePath}/sign-in`}
        signUpUrl={`${basePath}/sign-up`}
      />
    </div>
  );
}

function ClerkSignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-10">
      <SignUp
        routing="path"
        path={`${basePath}/sign-up`}
        signInUrl={`${basePath}/sign-in`}
      />
    </div>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <ClerkProvider
            publishableKey={clerkPubKey}
            proxyUrl={clerkProxyUrl}
            appearance={clerkAppearance}
            signInUrl={`${basePath}/sign-in`}
            signUpUrl={`${basePath}/sign-up`}
            routerPush={(to) => window.history.pushState({}, '', to)}
            routerReplace={(to) => window.history.replaceState({}, '', to)}
          >
            <Router />
          </ClerkProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
