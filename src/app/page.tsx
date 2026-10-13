'use cache'
import {Suspense} from "react";

export default async function Home() {

  return (
      <Suspense fallback={<div></div>}>
        <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans py-16">
          <div className={'text-3xl font-semibold'}>Mini Ticket Tracker</div>
          <main
              className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-16 px-16 sm:items-start">
          </main>
        </div>
      </Suspense>
  );
}