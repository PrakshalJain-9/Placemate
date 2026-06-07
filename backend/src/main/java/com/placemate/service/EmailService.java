package com.placemate.service;

import java.io.StringWriter;
import java.io.Writer;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailPreparationException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import com.placemate.dto.EmailDTOs.MailSendDTO;
import com.placemate.entity.enums.MailType;

import freemarker.template.Configuration;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class EmailService {

	private final Configuration templateConfiguration;
	private final JavaMailSender mailSender;
	@Value("${spring.mail.username}")
	private String mailUsername;
	
	@Value("${email.success.message}")
	private String successMessage;
	
	@Value("${email.failure.message}")
	private String failureMessage;
	
	
	public String sendMail(MailSendDTO mailDTO) {
		
		try {
			String senderMail = mailUsername;
			MimeMessage mimeMessage = mailSender.createMimeMessage();
			MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage, true);
			
			
			Map<String, Object> dataModel = new HashMap<>();
			dataModel.put("ownerName", mailDTO.name());
			dataModel.put("collegeName", mailDTO.collegeName());
			
			
			if (mailDTO.extraParams() != null) {
                dataModel.putAll(mailDTO.extraParams());
            }
			messageHelper.setTo(mailDTO.to());
			messageHelper.setSubject(mailDTO.mailType().getSubject());
			messageHelper.setFrom(senderMail);
			messageHelper.setText(messageFromTemplate(mailDTO.mailType(), dataModel), true);
			
			mailSender.send(mimeMessage);
			return String.format(successMessage, mailDTO.name());
		} catch (MessagingException e) {
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


