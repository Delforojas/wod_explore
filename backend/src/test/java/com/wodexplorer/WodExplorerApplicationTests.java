package com.wodexplorer;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import com.wodexplorer.support.MySqlIntegrationTest;

@SpringBootTest
@TestPropertySource(properties = {
        "jwt.secret=01234567890123456789012345678901",
        "jwt.expiration=3600000"
})
class WodExplorerApplicationTests extends MySqlIntegrationTest {

    @Test
    void contextLoads() {
    }
}
