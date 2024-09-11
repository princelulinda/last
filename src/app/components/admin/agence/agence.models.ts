export interface TellerDetailsModele {
  hr_operator: {
    organization: {
      institution_client: {
        client_full_name: string | null;
        client_code: number | null;
        picture: string | null;
        client_email: string | null;

        client_category: string | null;
        client_type: {
          title: string | null;
        };
      };
    };
    operator: {
      employee_client: {
        client_full_name: string;
        client_code: string | null;
        client_email: string | null;
        picture: string | null;
        is_merchant: boolean | null;
        client_type: {
          title: string | null;
        };
      };
    };
  };

  counter: {
    branch: {
      organization_tenant: {
        institution_client: {
          client_full_name: string | null;
          client_code: string | null;
          client_type: {
            title: string | null;
          };
        };
        is_active: boolean | null;
      };
    };

    name: string | null;
    formatted_code: string | null;
    created_at: Date | null;
    location: string | null;
  };
  hr_treasurer: {
    operator: {
      username: string | null;
      employee_client: {
        client_full_name: string;
        client_code: string | null;
        picture: string;
        client_type: {
          title: string | null;
        };
      };
    };
  };
}

export interface TreaureDetailsModele {
  operator: {
    employee_client: {
      client_full_name: string;
      client_email: string | null;
      is_merchant: boolean;
      picture: string;
      client_code: string | null;
      client_type: {
        title: string | null;
      };
    };
  };

  organization: {
    institution_client: {
      client_type: {
        title: string | null;
      };
      client_full_name: string | null;
      client_code: string | null;
      picture: string;
    };

    share_capital: string | null;
    is_active: boolean;
  };
}
