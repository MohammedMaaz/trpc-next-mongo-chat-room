import type { AppType } from "next/app";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { trpc } from "~/utils/trpc";
import { theme } from "~/utils/theme";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>tRPC Chat App</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
        <Notifications />
        <Component {...pageProps} />
      </MantineProvider>
    </>
  );
};

export default trpc.withTRPC(MyApp);
