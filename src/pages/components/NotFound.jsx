import { Button } from "@mui/material";
import ImgSrc from "../../assets/404.webp";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="unauth">
      <img src={ImgSrc} alt="NoImage" />
      <p>Page Not Found</p>
      <Button
        onClick={() => navigate(-1)}
        className="text-capitalize fs-5"
        variant="contained"
      >
        Go Back
      </Button>
    </div>
  );
};

export default NotFound;
