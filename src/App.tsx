import "./App.scss";
import { useState, useEffect } from "react";
import CreateForm from "./components/CreateForm";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@carbon/react";

const sampleData = [
  {
    id: 1,
    document_name: "Sample Document 1",
    created_at: "2025-01-12T10:30:00.000Z",
    fields: [
      {
        id: 1,
        field_seq: 10,
        is_mandatory: 1,
        field_type: 1,
        field_name: "First Name",
        document_id: 1,
        select_values: null,
      },
      {
        id: 2,
        field_seq: 20,
        is_mandatory: 1,
        field_type: 1,
        field_name: "Last Name",
        document_id: 1,
        select_values: null,
      },
    ],
  },
  {
    id: 2,
    document_name: "Sample Document 2",
    created_at: "2025-11-27T07:24:55.606Z",
    fields: [
      {
        id: 1,
        field_seq: 10,
        is_mandatory: 1,
        field_type: 1,
        field_name: "First Name",
        document_id: 2,
        select_values: null,
      },
      {
        id: 2,
        field_seq: 20,
        is_mandatory: 1,
        field_type: 1,
        field_name: "Last Name",
        document_id: 2,
        select_values: null,
      },
      {
        id: 3,
        field_seq: 30,
        is_mandatory: 1,
        field_type: 2,
        field_name: "Gender",
        document_id: 2,
        select_values: [
          {
            value: "male",
            label: "Male",
          },
          {
            value: "female",
            label: "Female",
          },
        ],
      },
      {
        id: 4,
        field_seq: 40,
        is_mandatory: 1,
        field_type: 3,
        field_name: "Age",
        document_id: 2,
        select_values: null,
      },
    ],
  },
];

interface SelectValue {
  value: string;
  label: string;
}

interface DocumentField {
  id: number;
  field_seq: number;
  is_mandatory: number; // 1 for true, 0 for false
  field_type: number; // 1=input, 2=select, 3=numberInput
  field_name: string;
  document_id: number;
  select_values: SelectValue[] | null;
}

interface Document {
  id: number;
  document_name: string;
  created_at: string; // ISO date string
  fields: DocumentField[];
}

function App() {
  const [documents] = useState<Document[] | null>(sampleData);
  useEffect(() => {
    const fetchDocuments = async () => {
      const response = await fetch(`http://localhost:3000/api/v1/documents`);
      const documentList = await response.json();
      console.log("documentList", documentList);
      // setDocuments(documentList?.data);
    };
    fetchDocuments();
  }, []);

  const [showTableView, setShowTableView] = useState<boolean>(true);

  return (
    <div className="app">
      {showTableView && (
        <div>
          <Button
            onClick={() => {
              setShowTableView(false);
            }}
          >
            New Document Form
          </Button>
          <Table aria-label="sample table" size="lg">
            <TableHead>
              <TableRow>
                <TableHeader>Id</TableHeader>
                <TableHeader>Document title</TableHeader>
                <TableHeader>Created date</TableHeader>
                <TableHeader>Document size</TableHeader>
                <TableHeader></TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {documents?.map((row) => (
                <TableRow>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.document_name}</TableCell>
                  <TableCell>{row.created_at}</TableCell>
                  <TableCell>{row.fields.length}</TableCell>
                  <TableCell>
                    <Button
                      kind="ghost"
                      onClick={() => {
                        setShowTableView(false);
                      }}
                    >
                      Document preview
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {!showTableView && <CreateForm setShowTableView={setShowTableView} />}
    </div>
  );
}

export default App;
