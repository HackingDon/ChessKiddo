import {
  Alert,
  Box,
  Button,
  Modal,
  Snackbar,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { TabList, TabContext, TabPanel } from "@mui/lab";
import { useEffect, useState } from "react";
import "./admin.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faTrash,
  faUpload,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { supabaseClient } from "../../utils/superbase";
import { downloadFile, fetchPdfs } from "../../utils/commonHelper";
import { createClient } from "@supabase/supabase-js";
import Tournaments from "../components/Tournaments";

const Admin = () => {
  const [state, setState] = useState({
    open: false,
    value: "1",
    isUser: true,
    level: "beginner",
    files: [],
    isLoading: false,
    openSnack: false,
    message: "",
    severity: "error",
    users: [],
    isEdit: false,
  });
  const [userData, setUserData] = useState({
    id: "",
    email: "",
    password: "",
    name: "",
    level: "beginner",
    userid: "",
  });
  const [fileData, setFileData] = useState({
    files: [],
    link: "",
    level: "beginner",
  });
  const [error, setError] = useState({
    email: "",
    password: "",
    name: "",
    userid: "",
    file: "",
    link: "",
  });

  const supabaseAdmin = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_ADMIN_KEY
  );

  const validate = (from) => {
    let error1 = {};
    if (from === "file") {
      fileData.files.length === 0
        ? (error1.file = "Select atleast one File")
        : (error1.file = "");
    }
    if (from === "user") {
      userData.email
        ? (error1.email = "")
        : (error1.email = "Email is Required");
      userData.password
        ? (error1.password = "")
        : (error1.password = "Password is Required");
      userData.name
        ? (error1.name = "")
        : (error1.name = "User Name is Required");
      userData.userid
        ? (error1.userid = "")
        : (error1.userid = "Id is Required");
    }
    setError(error1);
    if (!Object.values(error1).some(Boolean)) {
      return true;
    } else {
      return false;
    }
  };

  const handleOpenSnack = (message, severity) => {
    setState((prev) => ({
      ...prev,
      isLoading: false,
      message: message,
      openSnack: true,
      severity: severity,
    }));
  };

  const updatePdfTable = async (name, ref_link, level) => {
    const { data, error } = await supabaseAdmin
      .from("document")
      .insert([{ file_name: name, link: ref_link, level: level }]);
    return error;
  };

  const uploadPdfs = async (e) => {
    e.preventDefault();
    let validateData = validate("file");
    if (validateData) {
      const fileArray = Array.isArray(fileData.files)
        ? fileData.files
        : [fileData.files];
      const uploadFor = fileData.level;
      setState((prev) => ({ ...prev, isLoading: true }));
      for (const file of fileArray) {
        const filePath = `${uploadFor}/${Date.now()}_${file.name}`;

        const { data, error } = await supabaseClient.storage
          .from("pdfs")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });
        const error1 = await updatePdfTable(filePath, fileData.link, uploadFor);
        if (error || error1) {
          error
            ? handleOpenSnack(error.message, "error")
            : handleOpenSnack(error1.message, "error");
        } else {
          handleOpenSnack("File Uploaded Succesfully", "success");
        }
      }
      fetchPdfData();
      setFileData((prev) => ({ ...prev, files: [], link: "" }));
      setState((prev) => ({ ...prev, open: false }));
    }
  };

  const fetchPdfData = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    const { data, error } = await fetchPdfs(state.level);
    if (error) {
      handleOpenSnack(error.message, "error");
      setState((prev) => ({ ...prev, isLoading: false }));
    }
    if (data) {
      setState((prev) => ({ ...prev, files: [...data], isLoading: false }));
    }
  };

  useEffect(() => {
    if (state.value === "2") {
      fetchPdfData();
    } else {
      fetchUserData();
    }
  }, [state.value, state.level]);

  const fetchUserData = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    const { data, error } = await supabaseClient
      .from("users")
      .select("*")
      .eq("role", "student");
    if (error) {
      handleOpenSnack(error.message, "error");
      setState((prev) => ({ ...prev, isLoading: false }));
    }
    if (data) {
      setState((prev) => ({
        ...prev,
        users: [...data].sort((a, b) => a.userid - b.userid),
        isLoading: false,
      }));
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    let validateData = validate("user");
    if (validateData) {
      setState((prev) => ({ ...prev, isLoading: true }));
      const { data, error } = await supabaseClient.auth.signUp({
        email: userData.email,
        password: userData.password,
      });
      if (error) {
        handleOpenSnack(error.message, "error");
        setState((prev) => ({ ...prev, isLoading: false }));
      }
      const { data: data1, error: error1 } = await supabaseClient
        .from("users")
        .insert({
          id: data.user.id,
          email: data.user.email,
          full_name: userData.name,
          role: "student",
          level: userData.level,
          userid: userData.userid,
        });
      if (error1) {
        handleOpenSnack(error1.message, "error");
      } else {
        fetchUserData();
        handleOpenSnack("User Added Succesfully", "success");
      }
      setState((prev) => ({
        ...prev,
        isUser: false,
        open: false,
        isLoading: false,
      }));
    }
  };

  async function deleteFile(filePath) {
    if (confirm("Are you sure want to delete?")) {
      setState((prev) => ({ ...prev, isLoading: true }));
      const { data, error } = await supabaseClient.storage
        .from("pdfs") // bucket name
        .remove([filePath]);

      const { error1 } = await supabaseAdmin
        .from("document")
        .delete()
        .eq("file_name", filePath);

      setState((prev) => ({ ...prev, isLoading: false }));

      if (error || error1) {
        error
          ? handleOpenSnack(error.message, "error")
          : handleOpenSnack(error1.message, "error");
      } else {
        fetchPdfData();
        handleOpenSnack("File Deleted Succesfully", "success");
      }
    }
  }

  const openEditUser = (user) => {
    setState((prev) => ({ ...prev, open: true, isEdit: true }));
    setUserData((prev) => ({
      ...prev,
      id: user.id,
      email: user.email,
      name: user.full_name,
      level: user.level,
      userid: user.userid,
    }));
  };

  const updateUser = async (e) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, isLoading: true }));
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
      userData.id,
      {
        email: userData.email,
        user_metadata: {
          email: userData.email,
          full_name: userData.name,
          level: userData.level,
          userid: userData.userid,
        },
      }
    );
    if (authError) {
      handleOpenSnack(authError.message, "error");
      return;
    }

    const { error: tableError } = await supabaseAdmin
      .from("users")
      .update({
        email: userData.email,
        full_name: userData.name,
        level: userData.level,
        userid: userData.userid,
      })
      .eq("id", userData.id);

    if (!tableError) {
      handleOpenSnack("User Updated Succesfully", "success");
      setState((prev) => ({ ...prev, open: false }));
      fetchUserData();
    } else {
      handleOpenSnack(tableError.message, "error");
    }
    setState((prev) => ({ ...prev, isLoading: false }));
  };

  const deleteUser = async (id) => {
    if (confirm("Are You sure want to delete?")) {
      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(
        id
      );

      if (authError) {
        handleOpenSnack(authError.message, "error");
        return;
      }
      const { error: tableError } = await supabaseAdmin
        .from("users")
        .delete()
        .eq("id", id);

      if (tableError) {
        handleOpenSnack(tableError.message, "error");
      } else {
        fetchUserData();
        handleOpenSnack("User Deleted Succesfully", "success");
      }
    }
  };

  const handleChange = (_, newValue) => {
    setState((prev) => ({ ...prev, value: newValue }));
  };
  return (
    <div className="p-5">
      {state.isLoading && (
        <div className="loader-wrap">
          <div className="loading"></div>
        </div>
      )}
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={state.value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab
                label="User Management"
                value="1"
                className={`tabs ${
                  state.value === "1" ? "active" : ""
                } text-capitalize`}
              />
              <Tab
                label="File Management"
                value="2"
                className={`tabs ${
                  state.value === "2" ? "active" : ""
                } text-capitalize`}
              />
              <Tab
                label="Tournaments"
                value="3"
                className={`tabs ${
                  state.value === "3" ? "active" : ""
                } text-capitalize`}
              />
            </TabList>
          </Box>
          <TabPanel value="1">
            <div>
              <div className="d-flex justify-content-end mb-3">
                <Button
                  variant="contained"
                  size="small"
                  className="add-user text-capitalize"
                  onClick={() =>
                    setState((prev) => ({
                      ...prev,
                      open: true,
                      isEdit: false,
                      isUser: true,
                    }))
                  }
                >
                  <FontAwesomeIcon icon={faUserPlus} />
                  <span>Add Student</span>
                </Button>
              </div>
              <Table className="table table-bordered table-striped">
                <TableHead>
                  <TableRow>
                    <TableCell>UserId</TableCell>
                    <TableCell>Full Name</TableCell>
                    <TableCell> Email ID</TableCell>
                    <TableCell>Level</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {state.users.length > 0 ? (
                    state.users.map((user, ind) => (
                      <TableRow key={ind}>
                        <TableCell>{user.userid}</TableCell>
                        <TableCell>{user.full_name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.level}</TableCell>
                        <TableCell className="action">
                          <Button
                            size="small"
                            variant="outlined"
                            className="edit text-capitalize"
                            onClick={() => openEditUser(user)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                            <span>Edit</span>
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            className="del text-capitalize"
                            onClick={() => deleteUser(user.id)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        className="text-center text-danger"
                        colSpan={5}
                      >
                        No data Found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabPanel>
          <TabPanel value="2">
            <div className="container-fluid p-0">
              <div className="d-flex justify-content-between">
                <TextField
                  select
                  size="small"
                  style={{ width: "200px" }}
                  value={state.level}
                  className="mb-4"
                  onChange={(e) =>
                    setState((prev) => ({ ...prev, level: e.target.value }))
                  }
                  slotProps={{ select: { native: true } }}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </TextField>
                <Button
                  variant="contained"
                  size="small"
                  className="add-user text-capitalize"
                  onClick={() =>
                    setState((prev) => ({
                      ...prev,
                      open: true,
                      isEdit: false,
                      isUser: false,
                    }))
                  }
                >
                  <FontAwesomeIcon icon={faUpload} />
                  Upload Files
                </Button>
              </div>
            </div>
            <Table className="table table-bordered table-striped custom-table">
              <TableHead>
                <TableRow>
                  <TableCell>Date Uploaded</TableCell>
                  <TableCell>Document</TableCell>
                  <TableCell>Reference URL</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {state.files.length > 0 ? (
                  state.files.map((file, ind) => (
                    <TableRow key={ind}>
                      <TableCell>{file.created_at}</TableCell>
                      <TableCell>{file.file_name.split("/").pop()}</TableCell>
                      <TableCell>
                        <a
                          className="y-link"
                          href="https://www.youtube.com/"
                          target="blank"
                        >
                          {file.link}
                        </a>
                      </TableCell>
                      <TableCell className="action">
                        <Button
                          className="edit text-capitalize"
                          variant="outlined"
                          onClick={() => {
                            downloadFile(file.file_name);
                            handleOpenSnack(
                              "Please Wait for file download",
                              "info"
                            );
                          }}
                        >
                          <FontAwesomeIcon icon={faDownload} />
                          Download
                        </Button>
                        <Button
                          className="del text-capitalize"
                          variant="outlined"
                          onClick={() => deleteFile(file.file_name)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell className="text-center text-danger" colSpan={4}>
                      No data Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabPanel>
          <TabPanel value="3">
            <Tournaments />
          </TabPanel>
        </TabContext>
      </Box>

      <Modal open={state.open}>
        <Box
          sx={{
            bgcolor: "background.paper",
            width: "500px",
            position: "relative",
            top: "30%",
            left: "35%",
            border: "2px solid #000",
            borderRadius: "10px",
            boxShadow: 24,
          }}
        >
          <form
            onSubmit={
              state.isUser
                ? state.isEdit
                  ? updateUser
                  : handleAddUser
                : uploadPdfs
            }
            className="p-4"
          >
            {state.isUser ? (
              <>
                <h3 className="text-center">
                  {state.isEdit ? "Edit" : "Create"} User
                </h3>
                <TextField
                  label="Email"
                  size="small"
                  value={userData.email}
                  className="mb-4"
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  fullWidth
                  error={!!error.email}
                  helperText={error.email}
                />
                {!state.isEdit && (
                  <TextField
                    label="Password"
                    size="small"
                    value={userData.password}
                    className="mb-4"
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    fullWidth
                    error={!!error.password}
                    helperText={error.password}
                  />
                )}
                <TextField
                  label="Full Name"
                  size="small"
                  value={userData.name}
                  className="mb-4"
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  fullWidth
                  error={!!error.name}
                  helperText={error.name}
                />
                <TextField
                  label="UserId"
                  size="small"
                  value={userData.userid}
                  className="mb-4"
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, userid: e.target.value }))
                  }
                  fullWidth
                  error={!!error.userid}
                  helperText={error.userid}
                />
              </>
            ) : (
              <>
                <div className="mb-4">
                  <h4 className="text-center">Upload PDF Files</h4>
                  <label className="fw-semi-bold fs-5">Select Files:</label>
                  <input
                    type="file"
                    multiple
                    accept=".pdf"
                    onChange={(e) =>
                      setFileData((prev) => ({
                        ...prev,
                        files: Array.from(e.target.files),
                      }))
                    }
                  />
                  {error.file ? (
                    <div className="text-danger">{error.file}</div>
                  ) : (
                    <></>
                  )}
                </div>
                <TextField
                  size="small"
                  // type="url"
                  onChange={(e) =>
                    setFileData((prev) => ({ ...prev, link: e.target.value }))
                  }
                  value={fileData.link}
                  fullWidth
                  error={!!error.link}
                  helperText={error.link}
                  label="Reference link"
                  className="mb-4"
                />
              </>
            )}
            <TextField
              label="Level"
              size="small"
              className="mb-4"
              onChange={(e) => {
                if (state.isUser) {
                  setUserData((prev) => ({ ...prev, level: e.target.value }));
                } else {
                  setFileData((prev) => ({ ...prev, level: e.target.value }));
                }
              }}
              fullWidth
              select
              slotProps={{ select: { native: true } }}
              value={state.isUser ? userData.level : fileData.level}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </TextField>
            <div className="d-flex justify-content-around">
              <Button
                size="small"
                className="del cancel text-capitalize"
                variant="outlined"
                onClick={() => setState((prev) => ({ ...prev, open: false }))}
              >
                Close
              </Button>
              <Button
                size="small"
                type="submit"
                className="edit add text-capitalize"
                variant="outlined"
              >
                {state.isEdit ? "Update" : "Add"}
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
      <Snackbar
        open={state.openSnack}
        anchorOrigin={{ horizontal: "center", vertical: "top" }}
        autoHideDuration={3000}
        onClose={() => setState((prev) => ({ ...prev, openSnack: false }))}
      >
        <Alert severity={state.severity}>{state.message}</Alert>
      </Snackbar>
    </div>
  );
};

export default Admin;
