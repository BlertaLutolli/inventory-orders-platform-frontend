import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import FormRow from "../../components/ui/FormRow";
import { uomsApi } from "../../api/catalogApi";
import { UnitOfMeasure } from "../../types/catalog";

const schema = Yup.object({
  name: Yup.string().min(1, "Too short").max(100, "Too long").required("Required"),
  code: Yup.string().min(1, "Too short").max(50, "Too long").required("Required"),
  precision: Yup.number().min(0, ">= 0").max(6, "<= 6").optional(),
});

type Props = {
  existing?: Partial<UnitOfMeasure> | null;
  onSaved: (saved: UnitOfMeasure) => void;
  onCancel: () => void;
};

export default function UomsForm({ existing, onSaved, onCancel }: Props) {
  const isEdit = Boolean(existing?.id);
  return (
    <Formik
      enableReinitialize
      initialValues={{
        name: existing?.name ?? "",
        code: existing?.code ?? "",
        precision: existing?.precision ?? 0,
      }}
      validationSchema={schema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const payload = {
            name: values.name,
            code: values.code,
            precision: Number(values.precision ?? 0),
          };
          const saved = isEdit
            ? await uomsApi.update(existing!.id!, payload)
            : await uomsApi.create(payload);
          onSaved(saved);
        } finally { setSubmitting(false); }
      }}
    >
      {({ values, handleChange, isSubmitting }) => (
        <Form className="space-y-4">
          <FormRow>
            <div style={{ flex: 1 }}>
              <Input label="Name" name="name" value={values.name} onChange={handleChange} />
              <div className="text-red-500 text-sm"><ErrorMessage name="name" /></div>
            </div>
            <div style={{ flex: 1 }}>
              <Input label="Code" name="code" value={values.code} onChange={handleChange} />
              <div className="text-red-500 text-sm"><ErrorMessage name="code" /></div>
            </div>
          </FormRow>

          <FormRow>
            <div style={{ flex: 1 }}>
              <Input type="number" label="Precision" name="precision" value={String(values.precision ?? 0)} onChange={handleChange} />
              <div className="text-red-500 text-sm"><ErrorMessage name="precision" /></div>
            </div>
            <div style={{ flex: 1 }} />
          </FormRow>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Button type="button" onClick={onCancel}>Cancel</Button>
            <Button type="submit" variant="primary" loading={isSubmitting}>{isEdit ? "Save changes" : "Create"}</Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
