import {Map, Marker} from "pigeon-maps"


const LocationMapPicker = ({formData, setFormData}) => {
return (
    <Map
    height={300}
    defaultCenter={[26.14, 50.48]}
    defaultZoom={12}
    onClick={({latLng}) => {
        setFormData({...formData, lat: latLng[0], lng: latLng[1]})
    }}
    
    >
    {formData.lat && formData.lng && (
        <Marker width={50} anchor={[formData.lat, formData.lng]}/>
    )}
    </Map>
)
}


export default  LocationMapPicker