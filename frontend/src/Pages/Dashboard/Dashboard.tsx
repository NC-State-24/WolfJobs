import { useEffect, useState } from "react";
import JobDetailView from "../../components/Job/JobDetailView";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUserStore } from "../../store/UserStore";
import { useJobStore } from "../../store/JobStore";
import { useApplicationStore } from "../../store/ApplicationStore";
import JobListTile from "../../components/Job/JobListTile";
import { Button, Fab } from "@mui/material";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import ChatWindow from "../../components/Chat/ChatWindow";
import { fetchMessages, sendMessage } from "../../api/message";

const Dashboard = () => {
  const naviagte = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const updateName = useUserStore((state) => state.updateName);
  const updateEmail = useUserStore((state) => state.updateEmail);
  const updatePassword = useUserStore((state) => state.updatePassword);
  const updateAddress = useUserStore((state) => state.updateAddress);
  const updateRole = useUserStore((state) => state.updateRole);
  const updateDob = useUserStore((state) => state.updateDob);
  const updateSkills = useUserStore((state) => state.updateSkills);
  const updatePhonenumber = useUserStore((state) => state.updatePhonenumber);
  const updateId = useUserStore((state) => state.updateId);
  const updateAvailability = useUserStore((state) => state.updateAvailability);
  const updateGender = useUserStore((state) => state.updateGender);
  const updateHours = useUserStore((state) => state.updateHours);
  const updateIsLoggedIn = useUserStore((state) => state.updateIsLoggedIn);
  const updateResume = useUserStore((state) => state.updateResume);
  const updateResumeId = useUserStore((state) => state.updateResumeId);

  const role = useUserStore((state) => state.role);
  const managerId = useUserStore((state) => state.id);

  const updateJobList = useJobStore((state) => state.updateJobList);
  const jobList: Job[] = useJobStore((state) => state.jobList);

  const updateApplicationList = useApplicationStore(
    (state) => state.updateApplicationList
  );

  const applicationList: Application[] = useApplicationStore(
    (state) => state.applicationList
  );

  const [displayList, setDisplayList] = useState<Job[]>([]);

  useEffect(() => {
    const token: string = localStorage.getItem("token")!;
    if (!!!token) {
      naviagte("/login");
    }
    if (!!token) {
      const tokenInfo = token.split(".");
      const userInfo = JSON.parse(atob(tokenInfo[1]));

      updateName(userInfo.name);
      updateEmail(userInfo.email);
      updatePassword(userInfo.password);
      updateAddress(userInfo.address);
      updateRole(userInfo.role);
      updateDob(userInfo.dob);
      updateSkills(userInfo.skills);
      updatePhonenumber(userInfo.phonenumber);
      updateId(userInfo._id);
      updateAvailability(userInfo.availability);
      updateGender(userInfo.gender);
      updateHours(userInfo.hours);
      updateIsLoggedIn(true);
      updateResume(userInfo.resume);
      updateResumeId(userInfo.resumeId);
    }
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/v1/users/fetchapplications")
      .then((res) => {
        if (res.status !== 200) {
          toast.error("Error fetching applications");
          return;
        }
        updateApplicationList(res.data.application as Application[]);
      });

    axios
      .get("http://localhost:8000/api/v1/users", {
        params: { page: 1, limit: 25 },
      })
      .then((res) => {
        if (res.status !== 200) {
          toast.error("Error fetching jobs");
          return;
        }
        updateJobList(res.data.jobs as Job[]);
      });
  }, []);

  useEffect(() => {
    if (role === "Manager") {
      const temp = jobList.filter((item) => {
        return item.managerid === managerId;
      });
      setDisplayList(temp);
    } else if (role === "Applicant") {
      const applicantsJobs: Application[] = applicationList.filter(
        (item) => item.applicantid
      );
      const ids: string[] = [];
      for (let i = 0; i < applicantsJobs.length; i++) {
        const id = applicantsJobs[i]?.jobid || "";
        ids.push(id);
      }
      const temp = jobList.filter((item) => ids.includes(item._id));
      setDisplayList(temp);
    }
  }, [role, jobList, applicationList]);

  const [chats, setChats] = useState<any[]>([]);
  const [selectedApplication, setSelectedApplication] =
    useState<any>(undefined);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleFabClick = async () => {
    setIsChatOpen(true);
    try {
      const data = await fetchMessages(selectedApplication._id); // Trigger the API call here
      setChats(data);
    } catch (error) {
      console.error("Error fetching chats:", error);
      toast.error("Error fetching chats");
    }
  };

  const findAndSetApplicationId = (jobId: string) => {
    const application = applicationList?.find((item) => item.jobid === jobId);

    setSelectedApplication(application !== undefined ? application : {});
  };

  const handleSendMessage = async (message: string) => {
    try {
      const currentUser = localStorage.getItem("userId") || "";
      const managerId = selectedApplication.managerid;
      const applicantId = selectedApplication.applicantid;
      let fromUser: string, toUser: string;
      if (currentUser === selectedApplication.applicantid) {
        fromUser = currentUser;
        toUser = managerId;
      } else {
        fromUser = managerId;
        toUser = applicantId;
      }
      await sendMessage(message, fromUser, toUser, selectedApplication._id);
      const data = await fetchMessages(selectedApplication._id); // Trigger the API call here
      setChats(data);
    } catch (error) {
      console.error("Error sending chat:", error);
      toast.error("Error sending chat");
    }
  };

  const refreshChats = async (id: string) => {
    if (id) {
      const data = await fetchMessages(id); // Trigger the API call here
      setChats(data);
    }
  };

  return (
    <>
      <div className="content bg-slate-50">
        <div className="flex flex-row" style={{ height: "calc(100vh - 72px)" }}>
          <>
            <div className="w-4/12 pt-2 overflow-x-hidden overflow-y-scroll bg-white/60 px-9">
              <div className="py-4 text-2xl">
                {role === "Manager" ? "My Listings" : "My Applications"}
              </div>
              {displayList?.map((job: Job) => {
                let action;

                if (role === "Manager") {
                  action = "view-application";
                } else {
                  const application = applicationList?.find(
                    (item) =>
                      item.jobid === job._id && item.status === "screening"
                  );
                  action = application
                    ? "view-questionnaire"
                    : "view-application";
                }

                return (
                  <JobListTile
                    data={job}
                    key={job._id}
                    action={action}
                    onJobClicked={(jobId: string) =>
                      findAndSetApplicationId(jobId)
                    }
                  />
                );
              })}
            </div>
          </>
          <JobDetailView />
        </div>
      </div>
      <ChatWindow
        isOpen={isChatOpen}
        chats={chats}
        onClose={() => setIsChatOpen(false)}
        sendMessage={handleSendMessage}
        refreshChats={refreshChats}
        application={selectedApplication}
      />
      {selectedApplication !== undefined && role == "Applicant" && (
        <Fab
          color="primary"
          aria-label="open chat"
          sx={{
            position: "fixed",
            bottom: (theme) => theme.spacing(2),
            right: (theme) => theme.spacing(2),
          }}
          onClick={handleFabClick}
        >
          <ChatBubbleIcon />
        </Fab>
      )}
      {role === "Manager" && (
        <div className="fixed p-4 bottom-3 right-3">
          <Button
            onClick={(e) => {
              e.preventDefault();
              naviagte("/createjob");
            }}
            type="button"
            className="text-white bg-red-400 "
            style={{
              background: "#FF5353",
              borderRadius: "10px",
              textTransform: "none",
              fontSize: "18px",
              width: "250px",
            }}
            variant="contained"
          >
            Create Job +
          </Button>
        </div>
      )}
    </>
  );
};
export default Dashboard;
