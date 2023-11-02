import Signup from './components/Signup/Signup';
import Login from './components/Login/Login';
import HomePage from './components/HomePage/HomePage';
import Landlord from './components/Landlord/Landlord';
import DisplayProperty from './components/Landlord/DisplayProperty';
import EditProperty from './components/Landlord/EditProperty';
import Report from './components/Report/Report';
import PropertyDetailsPage from './components/HomePage/PropertyDetailsPage';
import SeniorsContact from './components/SeniorsContact/SeniorsContact';
import 'bootstrap/dist/css/bootstrap.min.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'


function App() {
  return (
    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/landlordpage" element={<Landlord />} />
        <Route path="/propertydisplay" element={<DisplayProperty />} />
        <Route path="/edit-property/:propertyId" element={<EditProperty />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/property/:propertyId" element={<PropertyDetailsPage />} />
        <Route path="/report" element={<Report />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/contact" element={<SeniorsContact />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;