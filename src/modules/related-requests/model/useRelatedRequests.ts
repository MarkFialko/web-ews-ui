import {
  useGetServiceByCodeIdQuery,
  useGetWorkgroupByLabelQuery,
  type WorkgroupSettingsDto,
} from "@modules/ticket-actions";
import type { RequestDTO } from "@shared/request";
import { useMemo, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { extractServiceCode } from "../utils/serviceCode";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

export interface WorkgroupServiceOption {
  groupTitle: string;
  workgroupLabel: string;
  service: string;
  setting: WorkgroupSettingsDto | null;
}

export interface FormValues {
  workgroupLabel: string;

  workgroupWithService: WorkgroupServiceOption;
  workgroupUUID: string;
  serviceUUID: string;

  assignee: string;
  changeAssignee: string;

  ks: Dayjs;

  reason: string;
  description: string;
}

interface Props {
  request: RequestDTO;
}

export const useRelatedRequests = (props: Props) => {
  const { request } = props;

  const form = useForm<FormValues>({
    mode: "onSubmit",
    defaultValues: {
      workgroupLabel: request.workGroup.workGroupLabel,
      workgroupWithService: {
        groupTitle: "",
        workgroupLabel: "",
        service: "",
        setting: null,
      },
      serviceUUID: "",
      workgroupUUID: "",
      assignee: "",
      changeAssignee: "",
      ks: dayjs(),
      reason: "",
      description: "",
    } as FormValues,
  });

  const workgroup = useWatch({
    control: form.control,
    name: "workgroupWithService",
  });

  const existingServiceCode =
    useWatch({
      control: form.control,
      name: "workgroupWithService.service",
    }) ?? "";

  const serviceCode = useMemo(() => {
    return extractServiceCode(existingServiceCode);
  }, [existingServiceCode]);

  const {
    currentData: serviceData,
    isFetching: isServiceFetching,
    isError: serviceError,
  } = useGetServiceByCodeIdQuery(serviceCode ?? "", {
    skip: !serviceCode,
  });

  const workgroupLabel =
    useWatch({
      control: form.control,
      name: "workgroupWithService.workgroupLabel",
    }) ?? "";

  const {
    currentData: workgroupDetails,
    isFetching: isWorkgroupFetching,
    isError: workgroupError,
  } = useGetWorkgroupByLabelQuery(workgroupLabel, {
    skip: !workgroupLabel,
  });

  const isFetching = isWorkgroupFetching || isServiceFetching;

  useEffect(() => {
    form.setValue("assignee", "", { shouldValidate: true });
  }, [workgroupLabel, form]);

  useEffect(() => {
    if (!workgroup?.workgroupLabel) {
      form.setValue("workgroupUUID", "");
      form.setValue("serviceUUID", "");
    }

    if (workgroupError) {
      form.setValue("workgroupUUID", "");
    }

    if (serviceError) {
      form.setValue("serviceUUID", "");
    }
    if (workgroupError || serviceError) {
      form.trigger("workgroupWithService");
    }
  }, [workgroupError, serviceError, workgroup?.workgroupLabel, form]);

  useEffect(() => {
    if (workgroupDetails) {
      form.setValue("workgroupUUID", workgroupDetails.id);
      form.trigger("workgroupWithService");
    }
  }, [workgroupDetails, form]);

  useEffect(() => {
    if (serviceData) {
      form.setValue("serviceUUID", serviceData.guid);
      form.trigger("workgroupWithService");
    }
  }, [serviceData, form]);

  return { form, isFetching };
};
