import PropTypes from 'prop-types';
import { addVehicleClicked } from '../../../redux/adminSlices/actions';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';



const VendorHeader = ({category,title}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  //Vendor add Vehicle
  const handleAddVehicle = () => {
    dispatch(addVehicleClicked(true));
    navigate('/vendorDashboard/vendorAddProduct')
  };

  return (
    <div className="mb-10 flex justify-between items-center ">
      <div>
      <p className="text-gray-400">
        {category}
      </p>
      <p className="text-slate-900 text-3xl font-extrabold tracking-tight ">
        {title}
      </p>
      </div>
      <button
        className='rounded-lg bg-blue-600 text-white px-5 py-2 font-bold'
        onClick={handleAddVehicle}
        type="button"
      >
        Add Vehicle
      </button>
      
        
    </div>
  )
}
VendorHeader.propTypes = {
  category:PropTypes.string,
  title: PropTypes.string.isRequired,
};

export default VendorHeader
