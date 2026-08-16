import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import DataTable from "../../components/dataTable/DataTable";
import { toast } from "react-toastify";
import { ComplaintContext } from "../../context/complaintContext/ComplaintContext";
import { getComplaints, markComplaintAsResolve, markComplaintInReview } from "../../context/complaintContext/apiCalls";
import { formatDateTime } from "../../utils/formatDate";
import "./complaintList.css";
import ComplaintViewModal from "../../components/complaintModal/ComplaintViewModal";

export default function ComplaintList() {
  const { complaints, dispatch } = useContext(ComplaintContext);

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    getComplaints(dispatch, toast);
  }, [dispatch]);

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "registeredBy.name",
      },
      {
        Header: "Type",
        accessor: "userType",
        Cell: ({ value }) => value?.toUpperCase(),
      },
      {
        Header: "Category",
        accessor: "category",
      },
      {
        Header: "Priority",
        accessor: "priority",
        Cell: ({ value }) => (
          <span className={`priority ${value?.toLowerCase()}`}>
            <span className="priorityDot" />
            {value}
          </span>
        ),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <span className={`status-badge status-${value?.toLowerCase().replace(/\s+/g, "-")}`}>
            {value}
          </span>
        ),
      },
      {
        Header: "Created",
        accessor: "createdAt",
        Cell: ({ value }) => formatDateTime(value),
      },
      {
        Header: "Actions",
        Cell: ({ row }) => {
          const complaint = row.original;

          return (
            <div className="action-buttons">
              <button
                className="btn-view"
                onClick={() => setSelectedComplaint(complaint)}
              >
                View
              </button>

              {complaint.status === "Pending" && (
                <button className="btn-review"
                  onClick={() => { markComplaintInReview(dispatch, toast, complaint._id) }}
                >
                  Mark In Review
                </button>
              )}

              {complaint.status === "In Review" && (
                <button className="btn-resolve"
                  onClick={() => {
                    const adminResponse = window.prompt(
                      "Enter resolution remarks (required):"
                    );

                    if (adminResponse === null) return;

                    const trimmedResponse = adminResponse.trim();

                    if (!trimmedResponse) {
                      toast.error("Resolution remark is required");
                      return;
                    }

                    markComplaintAsResolve(
                      dispatch,
                      toast,
                      complaint._id,
                      trimmedResponse
                    );
                  }}
                >
                  Resolve
                </button>
              )}
            </div>
          );
        },
      },
    ],
    []
  );

  const filteredComplaints = useMemo(() => {
    return (complaints || []).filter((item) => {
      const search = searchText.toLowerCase();

      const matchesSearch =
        item.registeredBy?.name?.toLowerCase().includes(search) ||
        item.registeredBy?.phone_number?.toLowerCase().includes(search) ||
        item.category?.toLowerCase().includes(search);

      const matchesStatus =
        !statusFilter || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [complaints, searchText, statusFilter]);

  return (
    <div className="complaintList">
      <DataTable
        title="Complaints"
        data={filteredComplaints}
        columns={columns}
        searchPlaceholder="Search by name, phone, category..."
        showFilter={true}
        filterKey={'status'}
        filterOptions={["Pending", "In Review", "Resolved", "Mine"]}
        onSearch={setSearchText}
        onFilterChange={setStatusFilter}
      />

      {selectedComplaint && (
        <ComplaintViewModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
        />
      )}
    </div>
  );
}