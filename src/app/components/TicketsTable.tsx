'use client'

import {
    Ticket,
    TicketListResponse,
    TicketStatus,
    TicketStatusCount,
    TicketStatusCountResponse
} from "@/app/utils/types";
import {Button, Group, Modal, Popover, Radio, Table, Textarea, TextInput} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

async function fetchTickets(): Promise<Ticket[]> {
    const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            url: '/tickets',
            method: 'GET'
        }),
    })
    if (!response.ok) {
        throw new Error('Could not load todos')
    }
    const res: TicketListResponse = await response.json()
    return res.items
}

async function fetchTicketsAggregates(): Promise<TicketStatusCount[]> {
    const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            url: '/tickets/stats',
            method: 'GET'
        }),
    })
    if (!response.ok) {
        throw new Error('Could not load todos')
    }
    const res: TicketStatusCountResponse = await response.json()
    return res.by_status
}

function TicketsTable() {

    const [opened, {open, close}] = useDisclosure(false);
    const queryClient = useQueryClient()

    const ticketsQuery = useQuery({
        queryKey: ['tickets'],
        queryFn: fetchTickets,
    })

    const tickets = ticketsQuery.data || []

    const ticketsAggregatesQuery = useQuery({
        queryKey: ['ticketsAggregates'],
        queryFn: fetchTicketsAggregates,
    })

    const ticketsAggregates = ticketsAggregatesQuery.data || []

    function invalidateQueries() {
        queryClient.invalidateQueries({queryKey: ['tickets']})
        queryClient.invalidateQueries({queryKey: ['ticketsAggregates']})
    }

    const mutation = useMutation({
        mutationFn: async (newTicket: Ticket): Promise<Ticket> => {
            const response = await fetch('/api/tickets', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    payload: newTicket,
                    url: '/tickets',
                    method: 'POST'
                }),
            })

            if (!response.ok) {
                throw new Error('Could not create todo')
            }

            return response.json()
        },
        onSuccess: () => {
            invalidateQueries()
            close()
        },
    })

    const mutationUpdateStatus = useMutation({
        mutationFn: async (ticket: Ticket): Promise<Ticket> => {
            const response = await fetch('/api/tickets', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    payload: {
                        'status': ticket.status,
                        'priority': ticket.priority
                    },
                    url: `/tickets/${ticket.id}`,
                    method: 'PATCH'
                }),
            })

            if (!response.ok) {
                throw new Error('Could not create todo')
            }

            return response.json()
        },
        onSuccess: () => {
            invalidateQueries()
            close()
        },
    })

    function getCardColor(status: TicketStatus) {
        switch (status) {
            case TicketStatus.open:
                return "bg-blue-400";
            case TicketStatus.closed:
                return "bg-green-500";
            default:
                return 'bg-orange-400';
        }
    }

    const rows = tickets.map((ticket, index) => {
        let status: TicketStatus = ticket.status || TicketStatus.open
        return <Table.Tr key={ticket.id}>
            <Table.Td>{index + 1}</Table.Td>
            <Table.Td>{ticket.title}</Table.Td>
            <Table.Td>{ticket.description}</Table.Td>
            <Table.Td>
                {ticket.status}
            </Table.Td>
            <Table.Td>{ticket.priority}</Table.Td>
            <Table.Td>{ticket.created_at}</Table.Td>
            <Table.Td>
                <div className={'flex items-center gap-2'}>
                    <Popover width={300} trapFocus position="bottom" withArrow shadow="md">
                        <Popover.Target>
                            <Button>Edit</Button>
                        </Popover.Target>
                        <Popover.Dropdown>
                            <div className={'flex flex-col gap-2'}>
                                <Radio.Group
                                    defaultValue={ticket.status}
                                    name="status"
                                    label="Update Ticket Status"
                                    description="Select one option"
                                >
                                    <Group
                                        onChange={(value) => status = value.target.getAttribute("value") as TicketStatus}
                                        mt="xs">
                                        <Radio label="Open" value={TicketStatus.open} />
                                        <Radio label="In Progress" value={TicketStatus.in_progress} />
                                        <Radio label="Closed" value={TicketStatus.closed} />
                                    </Group>
                                </Radio.Group>
                                <div className={'flex items-center justify-end'}>
                                    <Button loading={mutationUpdateStatus.isPending} onClick={() => mutationUpdateStatus.mutate({
                                        ...ticket,
                                        status: status
                                    })}>Confirm</Button>
                                </div>
                            </div>
                        </Popover.Dropdown>
                    </Popover>
                </div>
            </Table.Td>
        </Table.Tr>
    });

    return (
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
            <div className={'text-2xl font-medium'}>Summary</div>
            <div className={'grid grid-cols-1 md:grid-cols-3 gap-6 w-full'}>
                {ticketsAggregates.map((tsc, index) => (
                    <div className={`'text-black p-8 ${getCardColor(tsc.status)} rounded-md text-white`}
                         key={tsc.status}>
                        {tsc.status.toUpperCase().replace('_', ' ')}
                        <h1 className={'font-semibold text-2xl'}>{tsc.count}</h1>
                    </div>
                ))}
            </div>
            <div className={'flex items-center justify-between w-full mt-8'}>
                <div className={'text-2xl font-medium'}>Tickets</div>
                <Button onClick={open}>
                    Create a Ticket
                </Button>
            </div>
            <Table>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>#</Table.Th>
                        <Table.Th>Title</Table.Th>
                        <Table.Th>Description</Table.Th>
                        <Table.Th>Status</Table.Th>
                        <Table.Th>Priority</Table.Th>
                        <Table.Th>Created At</Table.Th>
                        <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>

            <Modal opened={opened} onClose={close} title="Create a Ticket">
                <form
                    className={'flex flex-col gap-3'}
                    onSubmit={(event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        mutation.mutate({
                            title: formData.get('title')?.toString() || '',
                            description: formData.get('description')?.toString() || '',
                        })
                    }}
                >
                    <TextInput required={true} label="Title" name="title"/>
                    <Textarea required={false} rows={4} label="Description" name="description"/>
                    <div className="flex items-center justify-end gap-2 mt-4">
                        <Button variant={'subtle'} type="button" onClick={close}>Close</Button>
                        <Button loading={mutation.isPending} type="submit">Submit</Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default TicketsTable;