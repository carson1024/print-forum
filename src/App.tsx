import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts";
import Toastr from "components/toastr";

const App = () => {
  return (
    <>
    {
      <pre>
        Hi, Kornelijus,
        Hope you're doing well!

        I'm available to start working from this week. 
        But now, my Upwork account got unexpectedly blocked, and I'm currently in touch with their support team to sort it out. It might take a bit of time to get it back.

        In the meantime, I suggest we continue working outside of Upwork—maybe through Telegram (@dreamer2575) or Slack if that works better for project management.

        Let me know what you think.

        Best,
        Anton
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
