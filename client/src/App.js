import { Routes, Route} from 'react-router-dom'
import { Home, Login, RentalHouse, RentalRoom, RentalSpace, Apartment, MiniApartment, ServicedApartment, Colocation, DetailPost} from './containers/Public'
import { path} from './ultils/constant'

function App() {
  return (
    <div className="bg-primary">
      <Routes>
        <Route path={path.HOME} element={<Home />} >
          <Route index element={<RentalRoom />} />
          {/* <Route path={path.HOME__PAGE} element={<RentalRoom />} /> */}
          <Route path={path.LOGIN} element={<Login />} />
          <Route path={path.CAN_HO_CHUNG_CU} element={<Apartment />}/>
          <Route path={path.CAN_HO_DICH_VU} element={<ServicedApartment />} />
          <Route path={path.CAN_HO_MINI} element={<MiniApartment />} />
          <Route path={path.NHA_NGUYEN_CAN} element={<RentalHouse />} />
          <Route path={path.MAT_BANG} element={<RentalSpace />} />
          <Route path={path.O_GHEP} element={<Colocation />} />
          <Route path={path.DETAIL_POST__TITLE__POSTID} element={<DetailPost />} />
          <Route path={'chi-tiet/*'} element={<DetailPost />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
