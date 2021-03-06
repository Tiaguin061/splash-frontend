import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies } from "nookies";

export function withSSRAuth<P>(fn: GetServerSideProps<P>) {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx)

    if (!cookies['%40Lavimco%3Auser']) {
      return {
        redirect: {
          destination: '/login',
          permanent: false
        }
      }
    }

    return await fn(ctx)
  }
}
