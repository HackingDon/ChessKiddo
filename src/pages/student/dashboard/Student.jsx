import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import "./student.css";
import piece1 from "../../../assets/pieces.png";
import piece2 from "../../../assets/p.png";
import { useEffect, useRef, useState } from "react";
import { getUser, fetchPdfs, downloadFile } from "../../../utils/commonHelper";
import moment from "moment";

const Student = () => {
  const sliderRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const imgs = [
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Viswanathan_Anand_%282016%29_%28cropped%29.jpeg/640px-Viswanathan_Anand_%282016%29_%28cropped%29.jpeg",
      name: "VISWANATHAN ANAND",
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Praggnanandhaa_in_2025.jpg/640px-Praggnanandhaa_in_2025.jpg",
      name: "PRAGGNANANDHAA",
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Magnus_Carlsen_in_2023_%2852638329349%29.jpg/960px-Magnus_Carlsen_in_2023_%2852638329349%29.jpg?20240112051942",
      name: "MAGNUS CARLSEN",
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/The_President%2C_Dr._A.P.J._Abdul_Kalam_presenting_Padma_Shri_to_Kumari_Koneru_Humpy_%28Chess%29%2C_at_an_Investiture_Ceremony_at_Rashtrapati_Bhavan_in_New_Delhi_on_March_23%2C_2007.jpg/640px-thumbnail.jpg",
      name: "KONERU HUMPY",
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Gukesh_in_2025.jpg/640px-Gukesh_in_2025.jpg",
      name: "GUKESH",
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Garry_Kasparov_at_Google.jpg/800px-Garry_Kasparov_at_Google.jpg",
      name: "GARRY KASPROV",
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Fabiano_Caruana_2013.jpg/640px-Fabiano_Caruana_2013.jpg",
      name: "FABIANO CARUANA",
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/DivyaDeshmukh23.jpg/640px-DivyaDeshmukh23.jpg",
      name: "DIVYA DESHMUKH",
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/London_Chess_Classic_2016_Day2-2_%2831525646246%29_%28cropped%29.jpg/640px-London_Chess_Classic_2016_Day2-2_%2831525646246%29_%28cropped%29.jpg",
      name: "ARAVINDH CHITHAMBARAM",
    },
  ];
  const [files, setFiles] = useState([]);

  const fetchUser = async () => {
    setIsLoading(true);
    const { profile, fetchError } = await getUser();
    if (!fetchError) {
      const { data, error } = await fetchPdfs(profile.level);
      if (!error) {
        setFiles(data);
      }
      setUserData(profile);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (sliderRef.current) {
        const container = sliderRef.current;
        const containerWidth = container.offsetWidth;
        const scrollWidth = container.scrollWidth;
        const currentScroll = container.scrollLeft;

        if (currentScroll + containerWidth < scrollWidth - 10) {
          container.scrollBy({
            left: containerWidth,
            behavior: "smooth",
          });
        } else {
          container.scrollTo({
            left: 0,
            behavior: "smooth",
          });
        }
      }
    }, 2000);
    fetchUser();
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container-fluid p-0 chess-bg">
      {isLoading && (
        <div className="loader-wrap">
          <div className="loading"></div>
        </div>
      )}
      <div className="student-info">
        <div className="info-img ps-xl-5">
          <img className="king-img" src={piece1} alt="No Image" />
        </div>
        <div className="info-content">
          <p className="m-0 fw-bold fs-4">Welcome, {userData?.full_name}</p>
          <p className="student-name text-capitalize">
            {userData?.level} Level
          </p>
          <p className="info-quote">
            "Chess is the gymnasium of the mind". -- Blaise Pascal
          </p>
        </div>
        <div className="info-img pe-xl-5">
          <img className="king-img" src={piece2} alt="No Image" />
        </div>
      </div>
      <div className="std-body" ref={sliderRef}>
        {imgs.map((src, ind) => (
          <div key={ind} className="d-block img-container">
            <img className="slider-img" src={src.url} />
            <p className="text-center m-0">{src.name}</p>
          </div>
        ))}
      </div>
      <div className="p-3">
        <h3>Learning Sources:</h3>
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
            {files.length > 0 ? (
              files.map((file, ind) => (
                <TableRow key={ind}>
                  <TableCell>
                    {moment(file.created_at).format("DD/MM/YYYY")}
                  </TableCell>
                  <TableCell>{file.file_name.split("/")[1]}</TableCell>
                  <TableCell>
                    <a className="y-link" href={file.link} target="blank">
                      {file.link}
                    </a>
                  </TableCell>
                  <TableCell>
                    <Button
                      className="download"
                      onClick={() => downloadFile(file.file_name)}
                      variant="outlined"
                    >
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colspan={4} className="text-danger text-center">
                  No data Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Student;
