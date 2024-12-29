import React from "react";
import { getFiles } from "@/lib/actions/file.actions";
import { FileType, SearchParamProps } from "@/types";
import Sort from "@/components/Sort";
import { Models } from "node-appwrite";
import Card from "@/components/Card";
import { getFileTypesParams, convertFileSize } from "@/lib/utils";

const Page = async ({ searchParams, params }: SearchParamProps ) => {
    const type = ((await params)?.type as string) || "";
    const searchText = ((await searchParams)?.query as string) || "";
    const sort = ((await searchParams)?.sort as string) || "";

    const types = getFileTypesParams(type) as FileType[];

    const files = await getFiles({ types, searchText, sort });

    // Calculate total size of all files
  const totalSize = files.documents.reduce((acc: number, file: Models.Document) => acc + file.size, 0);
  const formattedTotalSize = convertFileSize(totalSize);


  return <div className="page-container">
    <section className="w-full">
        <h1 className="h1 capitalize">{type}</h1>

        <div className="total-size-section">
            <p className="body-1">
                Total space used: <span className="h5">{formattedTotalSize}</span>
            </p>

            <div className="sort-container">
                <p className="body-1 hidden sm:block text-light-200">Sort by:</p>

                <Sort />
            </div>
        </div>
    </section>

    {/* Render the files */}
    {files.total > 0 ? (
        <section className="file-list">
            {files.documents.map((file: Models.Document) => (
                <Card key={file.$id} file={file}/>
                
            ))}
        </section>
    ) : <p className="empty-list">No files uploaded</p>
}
  </div>;
};

export default Page;
