import {Link, useNavigate} from "react-router-dom";
import {toast} from "react-hot-toast";

const App = () => {
  const navigate = useNavigate();
  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/posts", {
        method: "POST",
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      console.log(res);
      if (res.ok) {
        navigate("/posts");
      }
      const data = await res.json();
      if (data.msg == "unauthorized! please login first") {
        navigate("/signin");
        toast.error(data.msg);
      }
    } catch (error) {
      console.log(error);
      toast.error("Not connected to backend");
    }
  };
  return (
    <>
      <div className=" h-screen w-screen ">
        <div className=" flex justify-end items-end">
          <Link to="/signup" className="bg-blue-500 m-auto  hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
            SingUp
          </Link>
          <div onClick={fetchData} className="bg-blue-500 m-auto cursor-pointer  hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
            Post
          </div>
        </div>
      </div>
    </>
  );
};
export default App;
