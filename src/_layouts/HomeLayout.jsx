import { Button, Menu, MenuItem } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { supabaseClient } from "../utils/superbase";
import { useState } from "react";
import logo from "../assets/logo.png";

const HomeLayout = (props) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [contact, setContact] = useState([]);

  const handleOpenMenu = (target, from) => {
    from === "contact"
      ? setContact(["6379175193", "9003521224"])
      : setContact(["chesskidoo37@gmail.com"]);
    setAnchorEl(target);
  };
  const logout = async () => {
    setIsLoading(true);
    const { error } = await supabaseClient.auth.signOut({ scope: "global" });
    if (error) {
      alert(error.message);
    } else {
      navigate("/");
    }
    setIsLoading(false);
  };
  return (
    <div className="home">
      {isLoading && (
        <div className="loader-wrap">
          <div className="loading"></div>
        </div>
      )}
      <div className="top-nav">
        <img src={logo} alt="Logo" />
        <div className="d-flex gap-3 align-items-center">
          {localStorage.getItem("userid") !== import.meta.env.VITE_ADMIN_ID ? (
            <>
              <Link className="fw-bold text-uppercase" to="/home">
                Home
              </Link>
              <Link className="fw-bold text-uppercase" to="/student">
                Dashboard
              </Link>
              <Link
                className="fw-bold text-uppercase"
                onClick={(e) => handleOpenMenu(e.currentTarget, "contact")}
              >
                Contact Us
              </Link>
              <Link
                className="fw-bold text-uppercase"
                onClick={(e) => handleOpenMenu(e.currentTarget, "mail")}
              >
                Email
              </Link>
            </>
          ) : (
            ""
          )}
          <Button variant="outlined" onClick={logout} size="small">
            Logout
          </Button>
        </div>
      </div>
      <div className="content">{props.children}</div>

      <footer>
        <p className="m-0 text-center">
          Copyright © 2025 ChessKiddo, Inc. All Rights Reserved.
        </p>
      </footer>
      <Menu open={open} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
        {contact.map((val) => (
          <MenuItem>{val}</MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default HomeLayout;
