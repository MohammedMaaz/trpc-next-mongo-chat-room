import type { AppType } from "next/app";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { trpc } from "~/utils/trpc";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Page title</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          globalStyles: () => ({
            "*, *::before, *::after": {
              boxSizing: "border-box",
            },
          }),
          colors: {
            navyBlue: [
              "#EBEFFA",
              "#C7D3F0",
              "#A3B7E6",
              "#7F9ADC",
              "#5B7ED2",
              "#3761C8",
              "#2C4EA0",
              "#213A78",
              "#162750",
              "#0B1328",
            ],
          },
          colorScheme: "light",
          defaultRadius: 0,
          primaryColor: "navyBlue",
        }}
      >
        <Notifications />
        <Component {...pageProps} />
      </MantineProvider>
    </>
  );
};

export default trpc.withTRPC(MyApp);
