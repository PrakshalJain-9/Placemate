package com.placemate.service;

import java.io.StringWriter;
import java.io.Writer;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailPreparationException;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.placemate.dto.EmailDTOs.MailSendDTO;
import com.placemate.entity.enums.MailType;

import freemarker.template.Configuration;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class EmailService {
	
	private final Configuration templateConfiguration;
	private final RestClient brevoRestClient;
	
	@Value("${spring.sender.name}")
	private String senderName;
	@Value("${spring.sender.email}")
	public String senderEmail;
	@Value("${email.success.message}")
	private String successMessage;
	
	@Value("${email.failure.message}")
	private String failureMessage;
	
	
	public String sendMail(MailSendDTO mailDTO) {
		
		try {
			Map<String, Object> dataModel = new HashMap<>();
			dataModel.put("ownerName", mailDTO.name());
			dataModel.put("collegeName", mailDTO.collegeName());
			if (mailDTO.extraParams() != null) {
                dataModel.putAll(mailDTO.extraParams());
            }

			String email = messageFromTemplate(mailDTO.mailType(), dataModel);
			Map<String, Object> messagePayload = Map.of(
					"sender", Map.of(
							"name", senderName,
							"email", senderEmail
					),
					"to", List.of(
							Map.of(
								"name", mailDTO.name(),
								"email", mailDTO.to()
						)
					),
					"subject", mailDTO.mailType().getSubject(),
					"htmlContent", email
			);
			
			brevoRestClient.post()
							.body(messagePayload)
							.retrieve()
							.toBodilessEntity();
			
			return String.format(successMessage, mailDTO.name());
		} catch (Exception e) {
			e.printStackTrace();
			return String.format(failureMessage, mailDTO.name());
		}
		
	}
	
	
	private String messageFromTemplate(MailType mailType, Map<String, Object> dataModel) {
		Writer writer = new StringWriter();
		try {
			templateConfiguration.getTemplate(mailType.getTemplateFileName()).process(dataModel, writer);
			return writer.toString();
		}catch(Exception e) {
			throw new MailPreparationException("Could not build Email from template body", e);
		}
	}
}


