package com.example.application.data.generator;

import com.vaadin.flow.spring.annotation.SpringComponent;

import com.example.application.data.service.EventRepository;
import com.example.application.data.entity.Event;

import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.vaadin.artur.exampledata.DataType;
import org.vaadin.artur.exampledata.ExampleDataGenerator;

@SpringComponent
public class DataGenerator {

    @Bean
    public CommandLineRunner loadData(EventRepository eventRepository) {
        return args -> {
            Logger logger = LoggerFactory.getLogger(getClass());
            if (eventRepository.count() != 0L) {
                logger.info("Using existing database");
                return;
            }
            int seed = 123;

            logger.info("Generating demo data");

            logger.info("... generating 100 Event entities...");
            ExampleDataGenerator<Event> eventRepositoryGenerator = new ExampleDataGenerator<>(Event.class,
                    LocalDateTime.of(2021, 6, 15, 0, 0, 0));
            eventRepositoryGenerator.setData(Event::setId, DataType.ID);
            eventRepositoryGenerator.setData(Event::setName, DataType.FOOD_PRODUCT_NAME);
            eventRepositoryGenerator.setData(Event::setDescription, DataType.SENTENCE);
            eventRepositoryGenerator.setData(Event::setEventDate, DataType.DATETIME_NEXT_30_DAYS);
            eventRepositoryGenerator.setData(Event::setLocation, DataType.CITY);
            eventRepositoryGenerator.setData(Event::setMaxAttendees, DataType.NUMBER_UP_TO_100);
            eventRepository.saveAll(eventRepositoryGenerator.create(100, seed));

            logger.info("Generated demo data");
        };
    }

}