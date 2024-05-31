import { useState } from 'react';
import AddRoomForm from '../../../components/Form/AddRoomForm';
import useAuth from '../../../hooks/useAuth';
import { imageUpload } from '../../../api/utils';
import { useMutation } from '@tanstack/react-query';
import { axiosSecure } from '../../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AddRoom = () => {

    const navigate = useNavigate();

    const [imagePreview, setImagePreview] = useState();
    const [imageText, setImageText] = useState('Upload Image');
    const [loading, setLoading] = useState(false);

    const {user} = useAuth();

    // customize Date Range
    const [dates, setDates] = useState(
        {
            startDate: new Date(),
            endDate: null,
            key: 'selection'
        }
    )

    // Date range handler
    const handelDates = item =>{
        console.log(item);
        setDates(item.selection);
    }


    // Post data to server By Tans Stack*****
    const {mutateAsync} = useMutation({
        mutationFn: async roomData =>{
            const {data} = await axiosSecure.post('/room', roomData)

            return data;
        },
        onSuccess: () =>{
            console.log('Data Saved Successfully');
            setLoading(false);
            toast.success('Room Added Successfully')
            navigate('/dashboard/my-listings')
        }
    })


    // handel Form
    const handelSubmit = async e =>{
        e.preventDefault();

        setLoading(true);

        const form = e.target;

        const description = form.description.value;
        const bathrooms = form.bathrooms.value;
        const bedrooms = form.bedrooms.value;
        const total_guest = form.total_guest.value;
        const price = form.price.value;
        const image = form.image.files[0];
        const title = form.title.value;
        const category = form.category.value;
        const location = form.location.value;

        const to = dates.endDate;
        const from = dates.startDate;

        const host={
            name: user?.displayName,
            photo: user?.photoURL,
            email: user?.email,
        }

        try{
            const image_url = await imageUpload(image)
            console.log(image_url);

            const roomData = {
                host,from, to, location, category, title, image: image_url, price, total_guest, bedrooms, bathrooms, description
            }
            console.table(roomData);

            // Post roomData to Server
            await mutateAsync(roomData)


        }catch(err){
            console.log(err);
            setLoading(false);
            toast.error(err.message)
        }
    }


    // Upload Image
    const handelImage = image =>{
        setImagePreview(URL.createObjectURL(image));
        setImageText(image.name);
    }

    return (
        <div>
            {/* Form */}
            <AddRoomForm dates={dates} handelDates={handelDates} handelSubmit={handelSubmit} 
            setImagePreview={setImagePreview} imagePreview={imagePreview} handelImage={handelImage}
            imageText={imageText} loading={loading}
            ></AddRoomForm>
        </div>
    );
};

export default AddRoom;