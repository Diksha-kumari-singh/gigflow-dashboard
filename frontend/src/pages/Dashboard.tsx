import { useEffect, useState } from "react";

import API from "../services/api";

interface Lead {

  _id: string;

  name: string;

  email: string;

  status: string;

  source: string;
}

function Dashboard() {

  const [leads, setLeads] =
    useState<Lead[]>([]);
  const [name, setName] =
  useState("");

  const [email, setEmail] =
    useState("");

  const [status, setStatus] =
    useState("New");

  const [source, setSource] =
    useState("Website");

  const [search, setSearch] =
  useState("");

  const [filterStatus, setFilterStatus] =
    useState("");

  const [filterSource, setFilterSource] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [sort, setSort] =
    useState("latest");
  const getLeads = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res = await API.get(
      "/leads",
      {
        params: {
          search,
          status: filterStatus,
          source: filterSource,
          sort,
          page
        },

        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

      setLeads(res.data.leads);
      setTotalPages(
        res.data.totalPages
      );
    } catch (error) {

      console.log(error);

    }
  };
  const createLead = async (
  e: React.FormEvent
   ) => {

  e.preventDefault();
      if (!name || !email) {

      alert("Name and Email required");

      return;
    }
      try {

        const token =
          localStorage.getItem("token");

        await API.post(
          "/leads",
          {
            name,
            email,
            status,
            source
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

        // Refresh leads
        getLeads();

        // Clear form
        setName("");
        setEmail("");
        setStatus("New");
        setSource("Website");

      } catch (error) {

        console.log(error);

      }
  };
  const deleteLead = async (
    id: string
  ) => {

    try {

      const token =
        localStorage.getItem("token");

      await API.delete(
        `/leads/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      // Refresh table
      getLeads();

    } catch (error) {

      console.log(error);

    }
  };
      useEffect(() => {

       getLeads();

      }, [
          search,
          filterStatus,
          filterSource,
          sort,
          page
      ]);

      return (

        <div className="p-10 bg-gray-100 min-h-screen">

          <div className="flex justify-between items-center mb-8">

            <h1 className="text-4xl font-bold">
              GigFlow Dashboard
            </h1>

            <button

              onClick={() => {

                localStorage.removeItem("token");

                window.location.href = "/";
              }}

              className="bg-red-500 text-white px-5 py-2 rounded-lg"
            >
              Logout
            </button>

          </div>

          <div className="bg-white rounded-xl shadow p-5 overflow-x-auto">
                    <div className="bg-white rounded-xl shadow p-5 mb-8">

      <h2 className="text-2xl font-bold mb-4">
        Add Lead
      </h2>

      <form
        onSubmit={createLead}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >

        <input
          type="text"
          placeholder="Name"
          className="border p-3 rounded-lg"

          value={name}

          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"

          value={email}

          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <select
          className="border p-3 rounded-lg"

          value={status}

          onChange={(e) =>
            setStatus(e.target.value)
          }
        >

          <option>New</option>

          <option>Contacted</option>

          <option>Qualified</option>

          <option>Lost</option>

        </select>

        <select
          className="border p-3 rounded-lg"

          value={source}

          onChange={(e) =>
            setSource(e.target.value)
          }
        >

          <option>Website</option>

          <option>Instagram</option>

          <option>Referral</option>

        </select>

        <button
          className="bg-black text-white p-3 rounded-lg md:col-span-4"
        >
          Add Lead
        </button>

      </form>

    </div>
    <div className="bg-white p-5 rounded-xl shadow mb-6">

  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

    <input
      type="text"
      placeholder="Search leads..."
      className="border p-3 rounded-lg"

      value={search}

      onChange={(e) =>
        setSearch(e.target.value)
      }
    />

    <select
      className="border p-3 rounded-lg"

      value={filterStatus}

      onChange={(e) =>
        setFilterStatus(e.target.value)
      }
    >

      <option value="">
        All Status
      </option>

      <option value="New">
        New
      </option>

      <option value="Contacted">
        Contacted
      </option>

      <option value="Qualified">
        Qualified
      </option>

      <option value="Lost">
        Lost
      </option>

    </select>

    <select
      className="border p-3 rounded-lg"

      value={filterSource}

      onChange={(e) =>
        setFilterSource(e.target.value)
      }
    >

      <option value="">
        All Sources
      </option>

      <option value="Website">
        Website
      </option>

      <option value="Instagram">
        Instagram
      </option>

      <option value="Referral">
        Referral
      </option>

    </select>

    <select
      className="border p-3 rounded-lg"

      value={sort}

      onChange={(e) =>
        setSort(e.target.value)
      }
    >

      <option value="latest">
        Latest
      </option>

      <option value="oldest">
        Oldest
      </option>

    </select>

  </div>

</div>
        <table className="w-full border-collapse">

              <thead>

                <tr className="border-b">

                  <th className="text-left p-3">
                    Name
                  </th>

                  <th className="text-left p-3">
                    Email
                  </th>

                  <th className="text-left p-3">
                    Status
                  </th>

                  <th className="text-left p-3">
                    Source
                  </th>
                  <th className="text-left p-3">
                   Actions
                  </th>
                </tr>

              </thead>

              <tbody>

                {leads.map((lead) => (

                  <tr
                    key={lead._id}
                    className="border-b"
                  >

                    <td className="p-3">
                      {lead.name}
                    </td>

                    <td className="p-3">
                      {lead.email}
                    </td>

                    <td className="p-3">
                      {lead.status}
                    </td>

                    <td className="p-3">
                      {lead.source}
                    </td>
                    <td className="p-3">

                      <button
                        onClick={() =>
                          deleteLead(lead._id)
                        }

                        className="bg-red-500 text-white px-4 py-2 rounded-lg"
                      >
                        Delete
                      </button>

                    </td>
              </tr>
            ))}

          </tbody>

        </table>
        <div className="flex justify-center gap-4 mt-6">

          <button

            disabled={page === 1}

            onClick={() =>
              setPage(page - 1)
            }

            className="bg-black text-white px-5 py-2 rounded-lg disabled:bg-gray-400"
          >
            Previous
          </button>

          <div className="flex items-center font-bold">

            Page {page} of {totalPages}

          </div>

          <button

            disabled={page === totalPages}

            onClick={() =>
              setPage(page + 1)
            }

            className="bg-black text-white px-5 py-2 rounded-lg disabled:bg-gray-400"
          >
            Next
          </button>

        </div>
      </div>

    </div>
  );
}

export default Dashboard;