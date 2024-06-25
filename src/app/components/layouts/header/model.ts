// export interface organizationModel{

//   company_type_code: string,
//   institution_client: {
//     client_full_name: string,
//     picture: string,
//   }

// };
export interface organizationModel {
  company_type_code: string;
  institution_client: {
    client_full_name: string;
    picture: string;
  };
}
//is for clientInfo
export interface clientInfoModel {
  client: {
    picture: string;
    clientCode: string;
  };
}
//is for userInfo
export interface userInfoModel {
  email: string;
  username: string;
}
//is for corporates
export interface corporatesModel {
  organization: {
    company_type_code: string;
    institution_client: {
      client_full_name: string;
      picture: string;
    };
  };
}

export interface selectedCorporateModel {
  organization: {
    id: number;
    institution_client: {
      client_full_name: string;
      picture: string;
    };
  };
}
