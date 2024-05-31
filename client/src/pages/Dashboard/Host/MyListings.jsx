import { Helmet } from 'react-helmet-async'
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useMutation, useQuery } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import RoomDataRow from '../../../components/TableRows/RoomDataRows';
import toast from 'react-hot-toast';

const MyListings = () => {

    const { user } = useAuth();

    const axiosSecure = useAxiosSecure();

    // Fetch All room data I added
    const { data: rooms = [], isLoading, refetch } = useQuery({
        // here category is dependency
        queryKey: ['my-listings', user?.email],
        queryFn: async () => {
            const { data } = await axiosSecure.get(`/my-listings/${user?.email}`)
            return data;
        }
    })

    // console.log(rooms);


    // Delete Functionality

    const { mutateAsync } = useMutation({
        mutationFn: async (id) => {
            const { data } = await axiosSecure.delete(`/room/${id}`);
            return data;
        },
        onSuccess: data =>{
            console.log(data);
            refetch();
            toast.success('Successfully Deleted')
        }
    })

    const handelDelete = async id => {
        console.log(id);

        try {
            await mutateAsync(id)
        } catch (err) {
            console.log(err);
        }

    }

    if (isLoading) return <LoadingSpinner />

    return (
        <>
            <Helmet>
                <title>My Listings</title>
            </Helmet>

            <div className='container mx-auto px-4 sm:px-8'>
                <div className='py-8'>
                    <div className='-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto'>
                        <div className='inline-block min-w-full shadow rounded-lg overflow-hidden'>
                            <table className='min-w-full leading-normal'>
                                <thead>
                                    <tr>
                                        <th
                                            scope='col'
                                            className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                                        >
                                            Title
                                        </th>
                                        <th
                                            scope='col'
                                            className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                                        >
                                            Location
                                        </th>
                                        <th
                                            scope='col'
                                            className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                                        >
                                            Price
                                        </th>
                                        <th
                                            scope='col'
                                            className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                                        >
                                            From
                                        </th>
                                        <th
                                            scope='col'
                                            className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                                        >
                                            To
                                        </th>
                                        <th
                                            scope='col'
                                            className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                                        >
                                            Delete
                                        </th>
                                        <th
                                            scope='col'
                                            className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                                        >
                                            Update
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>{/* Room row data */}
                                    {
                                        rooms.map(room => <RoomDataRow key={room._id} room={room} refetch={refetch} handelDelete={handelDelete}></RoomDataRow>)
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MyListings