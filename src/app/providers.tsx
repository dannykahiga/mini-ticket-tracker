'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type * as React from 'react'
import {MantineProvider} from "@mantine/core";
import {useState} from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: { staleTime: 60_000 },
                },
            }),
    )
    return (
        <QueryClientProvider client={queryClient}>
            <MantineProvider>
                {children}
            </MantineProvider>
            <ReactQueryDevtools />
        </QueryClientProvider>
    )
}