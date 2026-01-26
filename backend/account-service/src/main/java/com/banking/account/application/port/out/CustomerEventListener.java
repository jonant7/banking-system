package com.banking.account.application.port.out;

import java.util.UUID;

public interface CustomerEventListener {

    boolean isCustomerActive(UUID customerId);

    String getCustomerName(UUID customerId);

    boolean customerExists(UUID customerId);

    void invalidateCache(UUID customerId);

    void clearCache();

}