import { Routes } from '@angular/router';
import { MyMarketDashboardComponent } from '../../components/dashboards/banking/my-market-dashboard/my-market-dashboard.component';
import { MerchantConfigComponent } from '../../components/merchant/merchant-config/merchant-config.component';
import { ProductConfigComponent } from '../../components/merchant/products/product-config/product-config.component';
import { AddProductComponent } from '../../components/merchant/products/add-product/add-product.component';
import { PaymentReportsComponent } from '../../components/merchant/statements/payment-reports/payment-reports.component';
import { TransferReportsComponent } from '../../components/merchant/statements/transfer-reports/transfer-reports.component';
import { MerchantTransferComponent } from '../../components/merchant/merchant-transfer/merchant-transfer.component';
import { SingleInvoicesComponent } from '../../components/dev/invoice/single-invoices/single-invoices.component';
import { InvoicesGroupsComponent } from '../../components/dev/invoice/invoices-groups/invoices-groups.component';
import { PurchaseComponent } from '../../components/dev/purchase/purchase.component';
import { InvoiceComponent } from '../../components/dev/invoice/invoice.component';
import { InvoicesByGroupComponent } from '../../components/dev/invoice/invoices-by-group/invoices-by-group.component';

export const myMarketRoutes: Routes = [
  { path: '', component: MyMarketDashboardComponent },
  { path: 'merchant-config', component: MerchantConfigComponent },
  { path: 'product-config', component: ProductConfigComponent },
  { path: 'add-product', component: AddProductComponent },
  { path: 'payment-reports', component: PaymentReportsComponent },
  { path: 'transfer-reports', component: TransferReportsComponent },
  { path: 'merchant-transfer', component: MerchantTransferComponent },
  { path: 'invoice', component: InvoiceComponent },
  { path: 'single-invoices', component: SingleInvoicesComponent },
  { path: 'invoices-groups', component: InvoicesGroupsComponent },
  { path: 'invoices-by-group', component: InvoicesByGroupComponent },
  { path: 'purchase', component: PurchaseComponent },
];
