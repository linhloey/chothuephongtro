import { Routes, Route} from 'react-router-dom'
import { Home, Login,HomePage,Collection, DetailPost} from './containers/Public'
import { System, Profile, ManageUser, AdminManagePost } from './containers/System'
import { path} from './ultils/constant'
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import CreatePost from './containers/System/CreatePost';
import ManagePost from './containers/System/ManagePost';

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
          <Route path='chi-tiet/:title/:postId' element={<DetailPost />} />
        </Route>
        <Route path={path.SYSTEM} element={<System />}>
          <Route path={path.THONG_TIN_CA_NHAN} element={<Profile />} />
          <Route path={path.QUAN_LY_NGUOI_DUNG} element={<ManageUser />} />
          <Route path={path.QUAN_LY_TAT_CA_BAI_DANG} element={<AdminManagePost />} />
          <Route path={path.TAO_MOI_BAI_DANG} element={<CreatePost />} />
          <Route path={path.QUAN_LY_BAI_DANG} element={<ManagePost />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;