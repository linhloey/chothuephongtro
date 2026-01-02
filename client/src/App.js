import { Routes, Route} from 'react-router-dom'
import { Home, Login,HomePage,Collection, RentalHouse, RentalRoom, DetailPost} from './containers/Public'
import { path} from './ultils/constant'

function App() {
  return (
    <div className="bg-primary">
      <Routes>
        <Route path={path.HOME} element={<Home />} >
          <Route index element={<HomePage />} />

          <Route path={path.LOGIN} element={<Login />} />
          
          <Route path={path.PHONG_TRO} element={<Collection />}/>
          <Route path={path.CAN_HO_CHUNG_CU} element={<Collection />}/>
          <Route path={path.CAN_HO_DICH_VU} element={<Collection />} />
          <Route path={path.CAN_HO_MINI} element={<Collection />} />
          <Route path={path.NHA_NGUYEN_CAN} element={<Collection />} />
          <Route path={path.MAT_BANG} element={<Collection />} />
          <Route path={path.O_GHEP} element={<Collection />} />

          <Route path={path.DETAIL_POST__TITLE__POSTID} element={<DetailPost />} />
          <Route path={'chi-tiet/*'} element={<DetailPost />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;