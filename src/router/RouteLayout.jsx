import { useEffect, useState } from "react";
import HomeLayout from "../_layouts/HomeLayout";
import Unauth from "../pages/components/Unauth";

export const StudentLayout = ({ Component }) => {
  return (
    <HomeLayout>
      <Component />
    </HomeLayout>
  );
};

export const AdminLayout = ({ Component }) => {
  const [userid, setUserid] = useState(null);

  useEffect(() => {
    setUserid(localStorage.getItem("userid"));
  }, []);
  if (userid === import.meta.env.VITE_ADMIN_ID) {
    return (
      <HomeLayout>
        <Component />
      </HomeLayout>
    );
  } else {
    return <Unauth />;
  }
};
