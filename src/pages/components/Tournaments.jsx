import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, Box, Button, Modal, Snackbar, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { supabaseClient } from "../../utils/superbase";
import { createClient } from "@supabase/supabase-js";
import { downloadFile } from "../../utils/commonHelper";

const Tournaments = () => {
  const [state, setState] = useState({
    open: false,
    files: [],
    isLoading: false,
    message: "",
    openSnack: false,
    severity: "",
  });
  const [error, setError] = useState({});
  const [fileData, setFileData] = useState({
    files: [],
    name: "",
  });
  const supabaseAdmin = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_ADMIN_KEY
  );

  const updatePdfTable = async (file_name, name) => {
    const { data, error } = await supabaseAdmin
      .from("tourns")
      .insert([{ file_name: file_name, name: name }]);
    return error;
  };

  useEffect(() => {
    fetchPdfs();
  }, []);

  const fetchPdfs = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    const { data, error } = await supabaseClient.from("tourns").select("*");
    if (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      handleOpenSnack(error.message, "error");
    } else {
      setState((prev) => ({
        ...prev,
        files: data,
        isLoading: false,
      }));
    }
  };
  const validate = () => {
    let error1 = {};
    fileData.files.length === 0
      ? (error1.file = "Select atleast one File")
      : (error1.file = "");

    fileData.name
      ? (error1.name = "")
      : (error1.name = "Tournament Name is Required");

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

  const uploadPdfs = async (e) => {
    e.preventDefault();
    let validateData = validate();
    if (validateData) {
      const fileArray = Array.isArray(fileData.files)
        ? fileData.files
        : [fileData.files];
      setState((prev) => ({ ...prev, isLoading: true }));
      for (const file of fileArray) {
        const filePath = `Tourns/${Date.now()}_${file.name}`;

        const { error } = await supabaseClient.storage
          .from("pdfs")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });
        const error1 = await updatePdfTable(filePath, fileData.name);
        if (error || error1) {
          error
            ? handleOpenSnack(error.message, "error")
            : handleOpenSnack(error1.message, "error");
        } else {
          handleOpenSnack("File Uploaded Succesfully", "success");
        }
      }
      fetchPdfs();
      setFileData((prev) => ({ ...prev, files: [], name: "" }));
      setState((prev) => ({ ...prev, open: false }));
    }
  };
  return (
    <>
      {state.isLoading && (
        <div className="loader-wrap">
          <div className="loading"></div>
        </div>
      )}
      {localStorage.getItem("userid") === import.meta.env.VITE_ADMIN_ID && (
        <div className="d-flex justify-content-end pe-5">
          <Button
            variant="contained"
            size="small"
            className="add-user text-capitalize"
            onClick={() =>
              setState((prev) => ({
                ...prev,
                open: true,
              }))
            }
          >
            <FontAwesomeIcon icon={faUpload} />
            Upload Files
          </Button>
        </div>
      )}
      {state.files.map((file) => (
        <div
          onClick={() => {
            downloadFile(file.file_name);
            handleOpenSnack("Please Wait for file download", "warning");
          }}
          className="d-flex justify-content-center mb-5 mt-4 tourns"
        >
          <div className="w-75 border border-secondary d-flex align-items-center justify-content-center h-100">
            <p className="fs-3">{file.name}</p>
          </div>
        </div>
      ))}

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
          <form onSubmit={uploadPdfs} className="p-4">
            <>
              <div className="mb-4">
                <h4 className="text-center">Upload PDF Files</h4>
                <label className="fw-semi-bold fs-5">Select Files:</label>
                <input
                  type="file"
                  multiple
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
                onChange={(e) =>
                  setFileData((prev) => ({ ...prev, name: e.target.value }))
                }
                value={fileData.name}
                fullWidth
                error={!!error.name}
                helperText={error.name}
                label="Tournament Name"
                className="mb-4"
              />
            </>
            <div className="d-flex justify-content-around">
              <Button
                size="small"
                className="del cancel text-capitalize"
                variant="outlined"
                onClick={() => {
                  setState((prev) => ({ ...prev, open: false }));
                  setError({});
                }}
              >
                Close
              </Button>
              <Button
                size="small"
                type="submit"
                className="edit add text-capitalize"
                variant="outlined"
              >
                Add
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
    </>
  );
};

export default Tournaments;
