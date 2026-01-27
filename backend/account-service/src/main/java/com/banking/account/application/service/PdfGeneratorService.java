package com.banking.account.application.service;

import com.banking.account.application.dto.AccountStatementReport;
import com.banking.account.application.dto.TransactionResponse;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Base64;

import static com.banking.account.infrastructure.util.MessageUtils.getMessage;

@Slf4j
@Service
public class PdfGeneratorService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

    public String generateAccountStatementPdf(AccountStatementReport report, String customerName) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            document.add(new Paragraph(getMessage("pdf.title"))
                    .setFontSize(18)
                    .simulateBold()
                    .setTextAlignment(TextAlignment.CENTER));

            document.add(new Paragraph(getMessage("pdf.customer") + ": " + customerName).setFontSize(12));
            document.add(new Paragraph(getMessage("pdf.period") + ": " +
                    report.getStartDate().format(DATE_FORMATTER) + " - " +
                    report.getEndDate().format(DATE_FORMATTER)).setFontSize(10));
            document.add(new Paragraph("\n"));

            for (AccountStatementReport.AccountWithTransactions accountData : report.getAccounts()) {
                document.add(new Paragraph(getMessage("pdf.account") + ": " +
                        accountData.getAccount().getAccountNumber())
                        .setFontSize(14)
                        .simulateBold());

                String accountType = getMessage("account." + accountData.getAccount().getAccountType());
                document.add(new Paragraph(getMessage("pdf.type") + ": " + accountType).setFontSize(10));
                document.add(new Paragraph(getMessage("pdf.initialBalance") + ": $" +
                        accountData.getAccount().getInitialBalance()).setFontSize(10));

                String status = accountData.getAccount().getStatus().isActive()
                        ? getMessage("pdf.active")
                        : getMessage("pdf.inactive");
                document.add(new Paragraph(getMessage("pdf.status") + ": " + status).setFontSize(10));
                document.add(new Paragraph("\n"));

                if (!accountData.getTransactions().isEmpty()) {
                    Table table = new Table(UnitValue.createPercentArray(new float[]{15, 20, 15, 20, 20}));
                    table.setWidth(UnitValue.createPercentValue(100));

                    table.addHeaderCell(createHeaderCell(getMessage("pdf.date")));
                    table.addHeaderCell(createHeaderCell(getMessage("pdf.transactionType")));
                    table.addHeaderCell(createHeaderCell(getMessage("pdf.amount")));
                    table.addHeaderCell(createHeaderCell(getMessage("pdf.balance")));
                    table.addHeaderCell(createHeaderCell(getMessage("pdf.reference")));

                    BigDecimal totalDebits = BigDecimal.ZERO;
                    BigDecimal totalCredits = BigDecimal.ZERO;

                    for (TransactionResponse transaction : accountData.getTransactions()) {
                        table.addCell(createCell(transaction.getCreatedAt()
                                .atZone(ZoneId.of("UTC"))
                                .format(DATE_FORMATTER)));

                        String transactionType = getMessage("transaction." + transaction.getType());
                        table.addCell(createCell(transactionType));

                        String amount = transaction.getType().toString().equals("WITHDRAWAL")
                                ? "-$" + transaction.getAmount()
                                : "$" + transaction.getAmount();
                        table.addCell(createCell(amount));

                        table.addCell(createCell("$" + transaction.getBalanceAfter()));
                        table.addCell(createCell(transaction.getReference() != null ? transaction.getReference() : ""));

                        if (transaction.getType().toString().equals("WITHDRAWAL")) {
                            totalDebits = totalDebits.add(transaction.getAmount());
                        } else {
                            totalCredits = totalCredits.add(transaction.getAmount());
                        }
                    }

                    document.add(table);
                    document.add(new Paragraph("\n"));
                    document.add(new Paragraph(getMessage("pdf.totalDebits") + ": $" + totalDebits)
                            .setFontSize(10).simulateBold());
                    document.add(new Paragraph(getMessage("pdf.totalCredits") + ": $" + totalCredits)
                            .setFontSize(10).simulateBold());
                    document.add(new Paragraph(getMessage("pdf.availableBalance") + ": $" +
                            accountData.getAccount().getCurrentBalance())
                            .setFontSize(12).simulateBold());
                } else {
                    document.add(new Paragraph(getMessage("pdf.noTransactions")).simulateItalic());
                }

                document.add(new Paragraph("\n"));
            }

            document.close();

            byte[] pdfBytes = baos.toByteArray();
            return Base64.getEncoder().encodeToString(pdfBytes);

        } catch (Exception e) {
            log.error("Error generating PDF: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }

    private Cell createHeaderCell(String text) {
        return new Cell()
                .add(new Paragraph(text).simulateBold())
                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                .setTextAlignment(TextAlignment.CENTER);
    }

    private Cell createCell(String text) {
        return new Cell()
                .add(new Paragraph(text))
                .setTextAlignment(TextAlignment.CENTER);
    }

}