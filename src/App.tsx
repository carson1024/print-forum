import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts";
import Toastr from "components/toastr";

const App = () => {
  return (
    <>
    {
      <pre>
        Hi, Kornelijus,<br/>
        Hope you're doing well!<br/>

        I'm available to start working from this week. <br/>
        But now, my Upwork account got unexpectedly blocked, and I'm currently in touch with their support team to sort it out. It might take a bit of time to get it back.<br/>

        In the meantime, I suggest we continue working outside of Upwork—maybe through Telegram (@dreamer2575) or Slack if that works better for project management.<br/>

        Let me know what you think.<br/>

        Best,<br/>
        Anton<br/>
      </pre>
    }
      {/* <Toastr />
      <Routes>
        <Route path="/*" element={<MainLayout />} />
      </Routes> */}
    </>
  );
};

export default App;
