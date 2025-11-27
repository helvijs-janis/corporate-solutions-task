import type { Dispatch, SetStateAction } from "react";
import {
  Button,
  ButtonSet,
  TextInput,
  MenuItemDivider,
  Checkbox,
  Select,
  SelectItem,
} from "@carbon/react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import axios from "axios";

interface CreateFormProps {
  setShowTableView: Dispatch<SetStateAction<boolean>>;
}

type FormValues = {
  document_name: string | null;
  field_count: number;
  document: {
    field_seq: number | null;
    is_mandatory: number;
    field_type: string | null;
    field_name: string | null;
    select_values: object | null;
  }[];
};

const CreateForm = ({ setShowTableView }: CreateFormProps) => {
  const { register, control, handleSubmit, setValue } = useForm<FormValues>({
    defaultValues: {
      document_name: null,
      field_count: 1,
      document: [
        {
          field_seq: null,
          is_mandatory: 1,
          field_type: null,
          field_name: null,
          select_values: null,
        },
      ],
    },
  });

  const { fields, append } = useFieldArray({
    name: "document",
    control,
  });

  const documentValues = useWatch({
    control,
    name: "document",
  });

  const postDocument = (data: FormValues) => {
    const formattedData = {
      document_name: data.document_name,
      field_count: data.document.length,
      form_values: data.document.map((item) => ({
        ...item,
        field_seq: Number(item.field_seq),
        field_type:
          item.field_type === "input"
            ? 1
            : item.field_type === "select"
            ? 2
            : 3,
        is_mandatory: Number(item.is_mandatory),
        select_values: item.select_values ? item.select_values : null,
      })),
    };

    return axios
      .post("http://localhost:3000/api/v1/documents/create", formattedData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log("res", res);
        setShowTableView(true);
      });
  };

  return (
    <div>
      <div className="app__row">
        <TextInput
          id="title-input"
          labelText="Document title"
          placeholder="Enter title"
          defaultValue=""
          {...register(`document_name`)}
        />
      </div>

      <div className="app__row--divider">
        <MenuItemDivider />
      </div>

      <form
        onSubmit={handleSubmit((data) => {
          postDocument(data);
        })}
      >
        {fields.map((field, index) => {
          return (
            <section key={field.id}>
              <div className="app__row">
                <TextInput
                  // {...register(`document.field_seq`)}
                  id="field-sequence"
                  labelText="Field sequence (weight)"
                  placeholder="Enter sequence"
                  defaultValue=""
                  {...register(`document.${index}.field_seq`)}
                />
              </div>

              <div className="app__row">
                <Select
                  id={`field-type`}
                  labelText="Field type"
                  {...register(`document.${index}.field_type`)}
                  onChange={(e) => {
                    setValue(`document.${index}.field_type`, e.target.value);
                  }}
                >
                  <SelectItem value="input" text="Input" />
                  <SelectItem value="select" text="Select" />
                  <SelectItem value="number-input" text="NumberInput" />
                </Select>
              </div>

              {documentValues[index]?.field_type === "select" && (
                <div className="app__row">
                  <TextInput
                    id="json-input"
                    labelText="Select options (in json format)"
                    placeholder="Enter select options"
                    defaultValue=""
                    {...register(`document.${index}.select_values`)}
                  />
                </div>
              )}

              <div className="app__row">
                <TextInput
                  id="field-name"
                  labelText="Field name"
                  placeholder="Enter name"
                  defaultValue=""
                  {...register(`document.${index}.field_name`)}
                />
              </div>

              <div className="app__row app__row--checkbox">
                <Checkbox
                  id={`field-mandatory-${index}`}
                  labelText="Mandatory"
                  defaultChecked={false}
                  {...register(`document.${index}.is_mandatory`)}
                />
              </div>

              <div className="app__row--divider">
                <MenuItemDivider />
              </div>
            </section>
          );
        })}

        <ButtonSet>
          <Button
            kind="secondary"
            onClick={() => {
              append({
                field_seq: null,
                is_mandatory: 1,
                field_type: null,
                field_name: null,
                select_values: null,
              });
            }}
          >
            Add more
          </Button>
          <Button kind="primary" type="submit">
            Save
          </Button>
        </ButtonSet>
      </form>
    </div>
  );
};

export default CreateForm;
