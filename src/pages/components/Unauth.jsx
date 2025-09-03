import { Button } from "@mui/material";
import ImgSrc from "../../assets/unauth.webp";
import { useNavigate } from "react-router-dom";

const Unauth = () => {
  const navigate = useNavigate();
  return (
    <div className="unauth">
      <img src={ImgSrc} alt="NoImage" />
      <p>Unauthorised page Go back to Login</p>
      <Button
        onClick={() => navigate("/")}
        className="text-capitalize fs-5"
        variant="contained"
      >
        Login
      </Button>
    </div>
  );
};

export default Unauth;
