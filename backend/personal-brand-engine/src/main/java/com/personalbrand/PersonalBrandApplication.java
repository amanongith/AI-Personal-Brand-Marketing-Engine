package com.personalbrand;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class PersonalBrandApplication {

    public static void main(String[] args) {
        SpringApplication.run(PersonalBrandApplication.class, args);
    }

}