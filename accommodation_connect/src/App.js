import Signup from './components/Signup/Signup';
import Login from './components/Login/Login';
import HomePage from './components/HomePage/HomePage';
import Landlord from './components/Landlord/Landlord';
import DisplayProperty from './components/Landlord/DisplayProperty';
import EditProperty from './components/Landlord/EditProperty';
import Report from './components/Report/Report';
import PropertyDetailsPage from './components/HomePage/PropertyDetailsPage';
import Notification from './components/Landlord/Notification';
import Raiseproblem from './components/Communicationtools/Raiseproblem';
import SolutionForm from './components/Communicationtools/Solutionform';
import Problemform from './components/Communicationtools/Problemform';
import About from './components/About/About';
import Editabout from './components/About/Editabout';
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
        <Route path="/connect" element={<Raiseproblem />} />
        <Route path="/connectsolutionform/:id" element={<SolutionForm />} />
        <Route path="/connectproblemform" element={<Problemform />} />
        <Route path="/notifications" element={<Notification />} />
        <Route path="/about" element={<About />} />
        <Route path="/editabout/:userId" element={<Editabout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;