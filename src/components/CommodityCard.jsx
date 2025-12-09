
import {  Heart, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';



export const CommodityCard = ({ commodity, onFavorite }) => (
  <Link to={`/requirements/${commodity._id}`}>
  
  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
    <div className="relative">
      <div className="bg-gradient-to-br from-amber-100 to-orange-100 h-48 flex items-center justify-center text-7xl">
        
        <img src={commodity.images??images[0]} alt=""  className='object-fill h-full w-full'/>
        
      </div>
      {commodity.featured && (
        <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded font-medium">
          Featured
        </span>
      )}
      <button
        onClick={() => onFavorite(commodity.id)}
        className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50"
      >
        <Heart className="w-5 h-5 text-gray-600" />
      </button>
    </div>
    
    <div className="p-4">
      <p className="text-xs text-gray-500 mb-2">{commodity.postingDate}</p>
      <h3 className="font-medium text-gray-900 mb-3 line-clamp-2 h-12">
        {commodity.title}
      </h3>
      
      <div className="flex items-baseline gap-1 mb-3">
        <span className="text-xl font-bold text-gray-900">₹ {commodity.price.amount}</span>
        <span className="text-sm text-gray-600">/ {commodity.price.unit}</span>
      </div>
      
      <p className="text-sm text-gray-700 mb-1">{commodity.contractorInfo.name}</p>
      <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
        <MapPin className="w-4 h-4" />
        <span>{commodity.contractorInfo.state}</span>
      </div>
      
      <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors">
        Call Now
      </button>
    </div>
  </div>
  </Link>
);