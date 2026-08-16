import React, { useMemo, useState, useContext } from "react";
import { Search, KeyboardArrowUp, KeyboardArrowDown, UnfoldMore, ChevronLeft, ChevronRight, InboxOutlined } from "@mui/icons-material";
import { useTable, useSortBy, usePagination } from "react-table";
import "./dataTable.css";
import { AuthContext } from "../../context/authContext/AuthContext";

export default function DataTable({
    title = "Table",
    data = [],
    columns = [],
    showCreate = false,
    onCreateClick,
    buttonName,
    onButtonClick,
    searchPlaceholder = "Search...",
    showFilter = false,
    filterOptions = [],
    filterKey = null,
}) {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");
    const { user } = useContext(AuthContext);

    const filteredData = useMemo(() => {
        let result = Array.isArray(data) ? [...data] : [];
        const now = new Date();

        if (search) {
            const searchLower = search.toLowerCase();

            const flattenValues = (obj) => {
                let values = [];
                for (const key in obj) {
                    const val = obj[key];
                    if (!val) continue;

                    if (typeof val === "object") {
                        values = values.concat(flattenValues(val));
                    } else if (typeof val === "string" || typeof val === "number") {
                        values.push(String(val));
                    }
                }
                return values;
            };

            result = result.filter((item) => {
                const allValues = flattenValues(item);
                return allValues.some((val) => val.toLowerCase().includes(searchLower));
            });
        }

        const adminId = user?._id?.toString();
        switch (filter) {
            case "License Expired":
                result = result.filter(
                    (item) => item.license_expiry && new Date(item.license_expiry) < now
                );
                break;

            case "Insurance Expired":
                result = result.filter(
                    (item) => item.insurance_expiry && new Date(item.insurance_expiry) < now
                );
                break;

            case "Both Expired":
                result = result.filter(
                    (item) =>
                        item.license_expiry &&
                        new Date(item.license_expiry) < now &&
                        item.insurance_expiry &&
                        new Date(item.insurance_expiry) < now
                );
                break;
            case "Mine":
                result = result.filter((item) => {
                    const handledById =
                        typeof item.adminHandledBy === "string"
                            ? item.adminHandledBy
                            : item.adminHandledBy?._id;

                    return handledById?.toString() === adminId;
                });
                break;

            default:
                if (filter && filterKey) {
                    result = result.filter(
                        (item) => item[filterKey]?.toLowerCase() === filter.toLowerCase()
                    );
                }
                break;
        }

        return result;
    }, [data, search, filter, filterKey]);

    const tableColumns = useMemo(() => {
        if (buttonName) {
            return [
                ...columns,
                {
                    Header: "Actions",
                    accessor: "_id",
                    Cell: ({ row }) => (
                        <button
                            className="editButton"
                            onClick={() => onButtonClick(row.original)}
                        >
                            {buttonName}
                        </button>
                    ),
                },
            ];
        }
        return columns;
    }, [columns, onButtonClick]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        nextPage,
        previousPage,
        state: { pageIndex, pageSize },
        setPageSize,
    } = useTable(
        {
            columns: tableColumns,
            data: filteredData,
            initialState: { pageIndex: 0, pageSize: 10 },
        },
        useSortBy,
        usePagination
    );

    return (
        <div className="dataTable">
            <div className="tableHeader">
                <h2>{title}</h2>
                {showCreate && (
                    <button className="createButton" onClick={onCreateClick}>
                        Create
                    </button>
                )}
            </div>

            <div className="searchFilterRow">
                <div className="searchBar">
                    <Search className="searchIcon" />
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {filterOptions.length > 0 && showFilter && (
                    <div className="filterBar">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="">All</option>
                            {filterOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div className="tableScrollWrap">
                <table {...getTableProps()} className="reactTable">
                    <thead>
                        {headerGroups.map((hg) => (
                            <tr key={hg.id} {...hg.getHeaderGroupProps()}>
                                {hg.headers.map((col) => (
                                    <th
                                        key={col.id}
                                        {...col.getHeaderProps(col.getSortByToggleProps())}
                                    >
                                        <span className="thContent">
                                            {col.render("Header")}
                                            <span className="sortIcon">
                                                {col.isSorted ? (
                                                    col.isSortedDesc ? <KeyboardArrowDown fontSize="inherit" /> : <KeyboardArrowUp fontSize="inherit" />
                                                ) : (
                                                    <UnfoldMore fontSize="inherit" className="sortIconIdle" />
                                                )}
                                            </span>
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {page.map((row) => {
                            prepareRow(row);
                            return (
                                <tr key={row.id} {...row.getRowProps()}>
                                    {row.cells.map((cell) => (
                                        <td key={cell.column.id} {...cell.getCellProps()}>
                                            {cell.render("Cell")}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {page.length === 0 && (
                    <div className="noData">
                        <InboxOutlined style={{ fontSize: 32 }} />
                        <span>No results found</span>
                    </div>
                )}
            </div>

            <div className="pagination">
                <button className="pageNavButton" onClick={() => previousPage()} disabled={!canPreviousPage}>
                    <ChevronLeft fontSize="small" /> Prev
                </button>
                <span className="pageInfo">
                    Page {pageIndex + 1} of {pageOptions.length || 1}
                </span>
                <button className="pageNavButton" onClick={() => nextPage()} disabled={!canNextPage}>
                    Next <ChevronRight fontSize="small" />
                </button>
                <select
                    className="pageSizeSelect"
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                >
                    {[5, 10, 20, 50].map((size) => (
                        <option key={size} value={size}>
                            {size} / page
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}