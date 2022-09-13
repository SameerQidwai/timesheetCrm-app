import axios from "axios";

import { Api, formatDate, headers } from "./constant";

const url = `${Api}/employees/`;

export const getEmployee = (id, token) => {
    return axios
      .get(url + `/${id}`, { headers: headers(token) })
      .then((res) => {
        const { success, data, message } = res.data;
        if (success) {
            let setToken = (res.headers && res.headers.authorization)
            const { basic } = reStructure(data);
            return { success, data, basic, setToken };
        }
        return { success };
      })
      .catch((err) => {
        console.log(err)
        return {
          error: 'Please login again!',
          status: false,
          message: err.message,
        };
      });
  };


//---------------- HELPER ------------------
function reStructure(data) {
    const contactPerson = data.contactPersonOrganization
      ? data.contactPersonOrganization.contactPerson
      : {};
    const basic = {
      cpCode: `Emp-00${contactPerson.id}`,
      firstName: contactPerson.firstName,
      lastName: contactPerson.lastName,
      gender: contactPerson.gender,
      phoneNumber: contactPerson.phoneNumber,
      email: contactPerson.email,
      dateOfBirth: formatDate(contactPerson.dateOfBirth),
      birthPlace: contactPerson.birthPlace,
      address: contactPerson.address,
      stateId: contactPerson.stateId,
      username: data.username,
    //   password: data.password,
      roleId: data.roleId,
      lineManagerId: data.lineManagerId,
    };
    // const detail = {
    //   superannuationName: data.superannuationName,
    //   superannuationBankName: data.superannuationBankName,
    //   superannuationBankAccountOrMembershipNumber:
    //     data.superannuationBankAccountOrMembershipNumber,
    //   superannuationAbnOrUsi: data.superannuationAbnOrUsi,
    //   superannuationBankBsb: data.superannuationBankBsb,
    //   superannuationAddress: data.superannuationAddress,
    //   superannuationType: data.superannuationType,
    // };
    // const kin = {
    //   nextOfKinDateOfBirth: formatDate(data.nextOfKinDateOfBirth),
    //   nextOfKinEmail: data.nextOfKinEmail,
    //   nextOfKinGender: data.nextOfKinGender,
    //   nextOfKinName: data.nextOfKinName,
    //   nextOfKinPhoneNumber: data.nextOfKinPhoneNumber,
    //   nextOfKinRelation: data.nextOfKinRelation,
    // };
    // const bankAccount = data.bankAccounts.length > 0 ? data.bankAccounts[0] : {};
    // const bank = {
    //   bankName: bankAccount.name,
    //   bankAccountNo: bankAccount.accountNo,
    //   bankBsb: bankAccount.bsb,
    //   tfn: data.tfn,
    //   taxFreeThreshold: data.taxFreeThreshold,
    //   helpHECS: data.helpHECS,
    // };
    // const employmentContracts =
    //   data.employmentContracts.length > 0 ? data.employmentContracts[0] : {};
  
    // const billing = {
    //   employmentContractId: employmentContracts.id,
    //   employeeId: employmentContracts.employeeId,
    //   payslipEmail: employmentContracts.payslipEmail,
    //   membershipAccountNo: employmentContracts.membershipAccountNo,
    //   payFrequency: employmentContracts.payFrequency,
    //   startDate: formatDate(employmentContracts.startDate),
    //   endDate: formatDate(employmentContracts.endDate),
    //   type: employmentContracts.type,
    //   noOfHours: employmentContracts.noOfHours,
    //   noOfDays: employmentContracts.noOfDays,
    //   noOfHoursPer: employmentContracts.noOfHoursPer,
    //   remunerationAmount: employmentContracts.remunerationAmount,
    //   remunerationAmountPer: employmentContracts.remunerationAmountPer,
    //   comments: employmentContracts.comments,
    //   leaveRequestPolicyId: employmentContracts.leaveRequestPolicyId ?? 0,
    //   fileId: employmentContracts.fileId,
    //   file: employmentContracts.fileId
    //     ? [
    //         {
    //           id: employmentContracts.file.id,
    //           createdAt: employmentContracts.file.createdAt,
    //           fileId: employmentContracts.file.id,
    //           uid: employmentContracts.file.uniqueName,
    //           name: employmentContracts.file.originalName,
    //           type: employmentContracts.file.type,
    //           url: `${Api}/files/${employmentContracts.file.uniqueName}`,
    //         //   thumbUrl: thumbUrl(employmentContracts.file.type),
    //         },
    //       ]
    //     : [],
    // };
    // const train = {
    //   training: data.training,
    // };
    // return { basic, detail, kin, bank, billing, train };
    return {basic}
  }