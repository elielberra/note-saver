output "vpc_id" {
  description = "The ID of the VPC"
  value       = aws_vpc.vpc.id
}

output "subnet_id" {
  description = "The IDs of the subnet/s"
  value       = aws_subnet.subnet[*].id
}

output "vpc_name" {
  description = "The name of the VPC"
  value       = aws_vpc.vpc.tags["Name"]
}
