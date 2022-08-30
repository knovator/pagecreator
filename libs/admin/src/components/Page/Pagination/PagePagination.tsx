import React from "react";
import { usePageState } from "../../../context/PageContext";
import Pagination from "../../common/Pagination";

const PagePagination = () => {
	const { t, totalPages, totalRecords, currentPage, pageSize, setCurrentPage } = usePageState();
	return (
		<Pagination
			ofText={t("of")}
			pageText={t("page")}
			showingText={t("showing")}
			totalPages={totalPages}
			totalRecords={totalRecords}
			currentPage={currentPage}
			pageSize={pageSize}
			setCurrentPage={setCurrentPage}
		/>
	);
};

export default PagePagination;
